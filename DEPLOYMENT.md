# PropertyFlow - Complete Setup & Deployment Guide

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

---

## Step 1: Install Prerequisites on Your Mac

You need 4 tools installed. Open Terminal and run each one:

### 1a. Node.js (v22+)

```bash
# Check if already installed
node -v

# If not installed or below v20, install via Homebrew:
brew install node@22
```

If you don't have Homebrew: https://brew.sh

### 1b. pnpm (package manager)

```bash
# Install pnpm globally
npm install -g pnpm

# Verify
pnpm -v
```

### 1c. Terraform

```bash
brew tap hashicorp/tap
brew install hashicorp/tap/terraform

# Verify
terraform -v
```

### 1d. AWS CLI

```bash
brew install awscli

# Verify
aws --version
```

### 1e. Configure AWS Credentials

```bash
aws configure
```

Enter your AWS Access Key ID, Secret Access Key, region (`us-east-1`), and output format (`json`).

If you don't have AWS credentials yet:
1. Go to AWS Console → IAM → Users → Create User
2. Attach `AdministratorAccess` policy (for initial setup)
3. Create access key under Security Credentials tab

---

## Step 2: Clone & Install the Project

```bash
# Clone from GitHub
git clone https://github.com/elijahvw/property-flow-1.git
cd property-flow-1

# Install all dependencies (THIS IS REQUIRED before anything else works)
pnpm install
```

**This is the step you were missing** — `pnpm install` downloads all the libraries the project needs. Without it, commands like `pnpm test` or `pnpm dev` will fail.

### Verify It Works

```bash
# Run tests to make sure everything is good
pnpm test

# (Optional) Run locally for development
pnpm dev
# Then open http://localhost:5000
```

---

## Step 3: Auth0 Setup

Your Auth0 app is already created. You just need to update the callback URLs after deployment.

**Your Auth0 Settings:**
- **Domain**: `dev-p1y78gnnq2o2fssw.us.auth0.com`
- **Client ID**: `3PZ5sdaGiNxfmIlwSPnk4eh9uAPiIxDR`
- **API Audience**: `https://dev-p1y78gnnq2o2fssw.us.auth0.com/api/v2/`

### If Setting Up Auth0 from Scratch

1. Go to https://manage.auth0.com
2. Navigate to **Applications > Applications > Create Application**
3. Choose **Single Page Application**
4. In the **Settings** tab, configure:

| Setting | Value |
|---------|-------|
| **Allowed Callback URLs** | `http://localhost:5000/dashboard` |
| **Allowed Logout URLs** | `http://localhost:5000` |
| **Allowed Web Origins** | `http://localhost:5000` |

5. Navigate to **Applications > APIs > Create API**
6. Set the **Identifier** (audience) — this will be your `auth0_audience`

You'll add the production CloudFront URL to these settings later (after Step 5).

---

## Step 4: Configure Terraform Variables

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars` with a text editor:

```hcl
aws_region      = "us-east-1"
project_name    = "property-flow"
db_password     = "PICK-A-STRONG-PASSWORD-HERE"
jwt_secret      = "PICK-A-RANDOM-STRING-HERE"
auth0_domain    = "dev-p1y78gnnq2o2fssw.us.auth0.com"
auth0_audience  = "https://dev-p1y78gnnq2o2fssw.us.auth0.com/api/v2/"
auth0_client_id = "3PZ5sdaGiNxfmIlwSPnk4eh9uAPiIxDR"
```

Go back to the project root:
```bash
cd ..
```

---

## Step 5: Deploy to AWS

```bash
# Set Auth0 variables for the frontend build
export VITE_AUTH0_DOMAIN="dev-p1y78gnnq2o2fssw.us.auth0.com"
export VITE_AUTH0_CLIENT_ID="3PZ5sdaGiNxfmIlwSPnk4eh9uAPiIxDR"
export VITE_AUTH0_AUDIENCE="https://dev-p1y78gnnq2o2fssw.us.auth0.com/api/v2/"

# Run the deploy script
./scripts/deploy.sh
```

The script will:
1. Install dependencies (if needed)
2. Run tests
3. Build the Lambda backend
4. Create all AWS infrastructure (VPC, RDS, Lambda, CloudFront, etc.)
5. Build the frontend
6. Upload frontend to S3

It will ask you to confirm before creating AWS resources.

At the end, it will print your **Frontend URL** (CloudFront) and **API URL**.

---

## Step 6: Run Database Migrations

After Terraform creates the RDS database, you need to set up the tables. 

**Note:** RDS is in a private subnet (not accessible from the internet). You have two options:

### Option A: Temporary public access (quick & easy for initial setup)

Add a temporary security group rule in the AWS Console:
1. Go to AWS Console → VPC → Security Groups
2. Find the RDS security group (named `property-flow-rds-sg`)
3. Add an inbound rule: PostgreSQL (5432) from your IP
4. Run the migration:

```bash
# Get the RDS endpoint
cd terraform
DB_ENDPOINT=$(terraform output -raw db_endpoint)
cd ..

# Run migrations
DATABASE_URL="postgresql://postgres:YOUR_DB_PASSWORD@$DB_ENDPOINT:5432/propertyflow" pnpm migrate
```

5. **Remove the temporary security group rule** after migrations complete

### Option B: Use AWS Systems Manager (SSM) Session Manager

This is more secure. Set up SSM on the Lambda or create a bastion instance.

---

## Step 7: Update Auth0 Callback URLs

Go back to your Auth0 Dashboard and add the CloudFront URL:

1. **Applications > Applications** → select your app
2. Add to **Allowed Callback URLs**: `https://<cloudfront-domain>/dashboard`
3. Add to **Allowed Logout URLs**: `https://<cloudfront-domain>`
4. Add to **Allowed Web Origins**: `https://<cloudfront-domain>`
5. Click **Save Changes**

The CloudFront domain was printed at the end of the deploy script.

---

## Pushing Changes from Replit to GitHub

Changes made in Replit are saved locally but don't automatically go to GitHub. To sync:

### From Replit Shell:
```bash
git push origin main
```

If prompted for credentials, use a GitHub Personal Access Token:
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with `repo` scope
3. Use your GitHub username and the token as the password

### From Your Mac (after pulling):
```bash
cd property-flow-1
git pull origin main
```

---

## Updating the Application After Changes

### Backend changes only:
```bash
pnpm run build:lambda
cd terraform && terraform apply
```

### Frontend changes only:
```bash
VITE_API_URL="<api-url>" pnpm run build:client
aws s3 sync dist/spa/ s3://<bucket> --delete
aws cloudfront create-invalidation --distribution-id <cf-id> --paths "/*"
```

### Both (easiest):
```bash
./scripts/deploy.sh
```

---

## Running Locally for Development

```bash
cd property-flow-1
pnpm install          # Only needed once (or after package.json changes)
pnpm dev              # Starts dev server at http://localhost:5000
```

For local Auth0 login to work, make sure `http://localhost:5000` is in your Auth0 Allowed Callback/Logout/Origins URLs.

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

> Tip: To reduce costs, remove the NAT Gateway and run Lambda outside VPC (requires making RDS publicly accessible with security group restrictions).

---

## Troubleshooting

**"command not found" errors when running scripts**
- Run `pnpm install` first — this installs all project dependencies

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

**Changes not showing in GitHub**
- Replit doesn't auto-push to GitHub
- Run `git push origin main` from the Replit Shell
