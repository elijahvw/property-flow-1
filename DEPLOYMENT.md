# PropertyFlow - AWS Deployment Guide

## Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│  CloudFront  │────▶│   S3 (Frontend)  │     │   RDS       │
│  (HTTPS CDN) │     │   React SPA      │     │  PostgreSQL │
└─────────────┘     └──────────────────┘     └──────┬──────┘
                                                      │
┌─────────────┐     ┌──────────────────┐              │
│  API Gateway │────▶│   Lambda         │──────────────┘
│  (HTTP API)  │     │   Express.js     │
└─────────────┘     └──────────────────┘
                           │
                    ┌──────┴──────┐
                    │  VPC        │
                    │  Private    │
                    │  Subnets    │
                    └─────────────┘
```

## Prerequisites

1. **AWS CLI** configured with credentials: `aws configure`
2. **Terraform** >= 1.0: https://www.terraform.io/downloads
3. **Node.js** >= 22 and **pnpm**
4. **Auth0 account** with application configured

---

## Step 1: Auth0 Setup (Manual)

### Create an Auth0 Application

1. Go to your Auth0 Dashboard: https://manage.auth0.com
2. Navigate to **Applications > Applications > Create Application**
3. Choose **Single Page Application**
4. In the **Settings** tab, configure:

| Setting | Value |
|---------|-------|
| **Allowed Callback URLs** | `https://<your-cloudfront-url>/dashboard, http://localhost:5000/dashboard` |
| **Allowed Logout URLs** | `https://<your-cloudfront-url>, http://localhost:5000` |
| **Allowed Web Origins** | `https://<your-cloudfront-url>, http://localhost:5000` |

> Note: You'll get the CloudFront URL after running `terraform apply`. Come back and update these URLs.

### Create an Auth0 API

1. Navigate to **Applications > APIs > Create API**
2. Set the **Identifier** (audience) to match your `auth0_audience` variable
3. Enable **RBAC** if you want Auth0 to manage roles

### Note Your Settings

- **Domain**: `dev-p1y78gnnq2o2fssw.us.auth0.com`
- **Client ID**: `3PZ5sdaGiNxfmIlwSPnk4eh9uAPiIxDR`
- **API Audience**: `https://dev-p1y78gnnq2o2fssw.us.auth0.com/api/v2/`

---

## Step 2: Configure Terraform Variables

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars` with your values:

```hcl
aws_region      = "us-east-1"
project_name    = "property-flow"
db_password     = "your-strong-database-password"
jwt_secret      = "your-random-jwt-secret"
auth0_domain    = "dev-p1y78gnnq2o2fssw.us.auth0.com"
auth0_audience  = "https://dev-p1y78gnnq2o2fssw.us.auth0.com/api/v2/"
auth0_client_id = "3PZ5sdaGiNxfmIlwSPnk4eh9uAPiIxDR"
```

---

## Step 3: Deploy

### Option A: Automated (Recommended)

```bash
# Set Auth0 vars for frontend build
export VITE_AUTH0_DOMAIN="dev-p1y78gnnq2o2fssw.us.auth0.com"
export VITE_AUTH0_CLIENT_ID="3PZ5sdaGiNxfmIlwSPnk4eh9uAPiIxDR"
export VITE_AUTH0_AUDIENCE="https://dev-p1y78gnnq2o2fssw.us.auth0.com/api/v2/"

./scripts/deploy.sh
```

### Option B: Manual Step-by-Step

```bash
# 1. Run tests
pnpm test

# 2. Build Lambda
pnpm run build:lambda

# 3. Init & apply Terraform
cd terraform
terraform init
terraform plan
terraform apply

# 4. Get outputs
API_URL=$(terraform output -raw api_url)
BUCKET=$(terraform output -raw frontend_bucket_name)
CF_ID=$(terraform output -raw cloudfront_distribution_id)

# 5. Build frontend with API URL
cd ..
VITE_API_URL=$API_URL \
VITE_AUTH0_DOMAIN="dev-p1y78gnnq2o2fssw.us.auth0.com" \
VITE_AUTH0_CLIENT_ID="3PZ5sdaGiNxfmIlwSPnk4eh9uAPiIxDR" \
VITE_AUTH0_AUDIENCE="https://dev-p1y78gnnq2o2fssw.us.auth0.com/api/v2/" \
pnpm run build:client

# 6. Upload to S3
aws s3 sync dist/spa/ s3://$BUCKET --delete

# 7. Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id $CF_ID --paths "/*"
```

---

## Step 4: Run Database Migrations

After Terraform creates the RDS instance, run migrations:

```bash
# Get the database endpoint from Terraform
cd terraform
DB_ENDPOINT=$(terraform output -raw db_endpoint)

# Run migrations (replace password)
DATABASE_URL="postgresql://postgres:YOUR_DB_PASSWORD@$DB_ENDPOINT/propertyflow" pnpm migrate
```

> Note: RDS is in a private subnet. You'll need a bastion host, VPN, or SSM Session Manager to access it. Alternatively, add a temporary `aws_security_group_rule` for your IP.

---

## Step 5: Update Auth0 Callback URLs

After deployment, go back to Auth0 and update:

```
Allowed Callback URLs:    https://<cloudfront-domain>/dashboard
Allowed Logout URLs:      https://<cloudfront-domain>
Allowed Web Origins:      https://<cloudfront-domain>
```

The CloudFront domain is shown in the deployment output.

---

## Updating the Application

After code changes:

```bash
# Backend changes only
pnpm run build:lambda
cd terraform && terraform apply
# Lambda will auto-deploy with new code

# Frontend changes only
VITE_API_URL="<api-url>" pnpm run build:client
aws s3 sync dist/spa/ s3://<bucket> --delete
aws cloudfront create-invalidation --distribution-id <cf-id> --paths "/*"

# Both
./scripts/deploy.sh
```

---

## Cost Estimates (Monthly)

| Resource | Estimated Cost |
|----------|---------------|
| RDS db.t4g.micro | ~$13/mo |
| NAT Gateway | ~$32/mo + data |
| Lambda | Free tier (1M req/mo) |
| API Gateway | Free tier (1M req/mo) |
| S3 | < $1/mo |
| CloudFront | Free tier (1TB/mo) |
| **Total** | **~$45-60/mo** |

> Tip: To reduce costs, you can remove the NAT Gateway and run Lambda outside VPC (requires making RDS publicly accessible with security group restrictions).

---

## Troubleshooting

**Lambda can't reach RDS**
- Verify Lambda and RDS are in the same VPC
- Check security group rules allow Lambda SG to access RDS on port 5432
- Ensure NAT Gateway is active for Lambda internet access

**Auth0 login redirect fails**
- Verify callback URLs match exactly (including protocol and path)
- Check CORS settings in Auth0 application settings
- Ensure API audience matches between frontend and backend

**CloudFront returns 403**
- Check S3 bucket policy allows CloudFront OAI
- Verify `index.html` exists in S3 bucket
- Check custom error responses are configured for SPA routing
