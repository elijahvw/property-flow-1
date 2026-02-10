#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
TERRAFORM_DIR="$PROJECT_DIR/terraform"

echo "========================================="
echo "  PropertyFlow AWS Deployment"
echo "========================================="

echo ""
echo "[0/6] Checking prerequisites..."

if ! command -v node &> /dev/null; then
  echo "ERROR: Node.js is not installed."
  echo "Install Node.js 22+ from https://nodejs.org"
  exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
  echo "ERROR: Node.js 20+ required. You have $(node -v)."
  echo "Install from https://nodejs.org"
  exit 1
fi

if ! command -v pnpm &> /dev/null; then
  echo "pnpm not found. Installing pnpm..."
  npm install -g pnpm
fi

if ! command -v terraform &> /dev/null; then
  echo "ERROR: terraform is not installed. Install it from https://www.terraform.io/downloads"
  exit 1
fi

if ! command -v aws &> /dev/null; then
  echo "ERROR: AWS CLI is not installed. Install it from https://aws.amazon.com/cli/"
  exit 1
fi

aws sts get-caller-identity > /dev/null 2>&1 || {
  echo "ERROR: AWS credentials not configured. Run 'aws configure' first."
  exit 1
}

if [ -z "${VITE_AUTH0_DOMAIN:-}" ] || [ -z "${VITE_AUTH0_CLIENT_ID:-}" ] || [ -z "${VITE_AUTH0_AUDIENCE:-}" ]; then
  echo "WARNING: Auth0 environment variables not set. Frontend login will not work."
  echo "Set these before deploying:"
  echo "  export VITE_AUTH0_DOMAIN=your-auth0-domain"
  echo "  export VITE_AUTH0_CLIENT_ID=your-auth0-client-id"
  echo "  export VITE_AUTH0_AUDIENCE=your-auth0-audience"
  echo ""
  read -p "Continue anyway? (yes/no): " AUTH_CONFIRM
  if [ "$AUTH_CONFIRM" != "yes" ]; then
    exit 0
  fi
fi

echo "  Node.js: $(node -v)"
echo "  pnpm:    $(pnpm -v)"
echo "  Terraform: $(terraform -v | head -1)"
echo "  AWS CLI: $(aws --version | cut -d' ' -f1)"
echo "  All prerequisites OK."

echo ""
echo "[1/6] Installing dependencies & running tests..."
cd "$PROJECT_DIR"

if [ ! -d "node_modules" ]; then
  echo "  Installing dependencies (first time)..."
  pnpm install
fi

pnpm test

echo ""
echo "[2/6] Building Lambda backend..."
pnpm run build:lambda

echo ""
echo "[3/6] Initializing Terraform..."
cd "$TERRAFORM_DIR"

if [ ! -f terraform.tfvars ]; then
  echo "ERROR: terraform/terraform.tfvars not found."
  echo ""
  echo "Create it by running:"
  echo "  cp terraform/terraform.tfvars.example terraform/terraform.tfvars"
  echo ""
  echo "Then edit terraform/terraform.tfvars with your values (database password, Auth0 settings, etc.)"
  exit 1
fi

terraform init

echo ""
echo "[4/6] Planning infrastructure changes..."
terraform plan -out=tfplan

echo ""
read -p "Apply these changes? (yes/no): " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
  echo "Deployment cancelled."
  rm -f tfplan
  exit 0
fi

echo ""
echo "[5/6] Applying infrastructure..."
terraform apply tfplan
rm -f tfplan

API_URL=$(terraform output -raw api_url)
BUCKET_NAME=$(terraform output -raw frontend_bucket_name)
CF_DIST_ID=$(terraform output -raw cloudfront_distribution_id)
FRONTEND_URL=$(terraform output -raw frontend_url)

echo ""
echo "[6/6] Building and deploying frontend..."
cd "$PROJECT_DIR"

VITE_API_URL="$API_URL" \
VITE_AUTH0_DOMAIN="${VITE_AUTH0_DOMAIN:-}" \
VITE_AUTH0_CLIENT_ID="${VITE_AUTH0_CLIENT_ID:-}" \
VITE_AUTH0_AUDIENCE="${VITE_AUTH0_AUDIENCE:-}" \
pnpm run build:client

aws s3 sync dist/spa/ "s3://$BUCKET_NAME" --delete

echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id "$CF_DIST_ID" \
  --paths "/*" > /dev/null

echo ""
echo "========================================="
echo "  Deployment Complete!"
echo "========================================="
echo ""
echo "  Frontend: $FRONTEND_URL"
echo "  API:      $API_URL"
echo ""
echo "NEXT STEPS:"
echo ""
echo "1. Run database migrations:"
echo "   DATABASE_URL=<rds_connection_string> pnpm migrate"
echo "   (See DEPLOYMENT.md for how to connect to RDS)"
echo ""
echo "2. Update your Auth0 application settings:"
echo "   - Allowed Callback URLs:    $FRONTEND_URL/dashboard"
echo "   - Allowed Logout URLs:      $FRONTEND_URL"
echo "   - Allowed Web Origins:      $FRONTEND_URL"
echo ""
