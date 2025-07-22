# Google Cloud Setup Guide for HAIB Beauty Salon Platform

## Overview
This guide will help you set up the Google Cloud infrastructure for your beauty salon booking platform.

## Prerequisites
- Google Cloud Platform account
- Google Cloud CLI installed
- Node.js and npm/yarn installed

## 1. Google Cloud Project Setup

### Create a new project:
```bash
gcloud projects create haib-beauty-platform --name="HAIB Beauty Platform"
gcloud config set project haib-beauty-platform
```

### Enable required APIs:
```bash
gcloud services enable cloudsql.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable storage.googleapis.com
gcloud services enable firestore.googleapis.com
```

## 2. Database Setup (Cloud SQL - PostgreSQL)

### Create a PostgreSQL instance:
```bash
gcloud sql instances create haib-db \
    --database-version=POSTGRES_15 \
    --tier=db-f1-micro \
    --region=us-central1 \
    --storage-type=SSD \
    --storage-size=10GB \
    --backup-start-time=03:00
```

### Create the database:
```bash
gcloud sql databases create haib_production --instance=haib-db
```

### Create a database user:
```bash
gcloud sql users create haib_user \
    --instance=haib-db \
    --password=your_secure_password
```

### Get connection details:
```bash
# Get the connection name
gcloud sql instances describe haib-db --format="value(connectionName)"

# Get the public IP
gcloud sql instances describe haib-db --format="value(ipAddresses[0].ipAddress)"
```

## 3. Database Schema Setup

### Connect to your database and run the schema:
```bash
# Connect via Cloud SQL Proxy (recommended)
cloud_sql_proxy -instances=[CONNECTION_NAME]=tcp:5432 &

# Or connect directly using psql
psql "host=[PUBLIC_IP] port=5432 dbname=haib_production user=haib_user password=[PASSWORD] sslmode=require"
```

### Execute the schema file:
```sql
-- Run the contents of docs/database-schema.sql
\i docs/database-schema.sql
```

## 4. API Backend (Cloud Run)

### Create a Cloud Run service:
```bash
# Build and deploy your API container
gcloud run deploy haib-api \
    --image gcr.io/haib-beauty-platform/api:latest \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --set-env-vars="DATABASE_URL=postgresql://haib_user:[PASSWORD]@[DB_IP]:5432/haib_production"
```

## 5. Storage Setup (Cloud Storage)

### Create storage buckets:
```bash
# For user uploads (avatars, salon images)
gsutil mb gs://haib-user-uploads

# For static assets
gsutil mb gs://haib-static-assets

# Set appropriate permissions
gsutil iam ch allUsers:objectViewer gs://haib-static-assets
```

## 6. Environment Configuration

### Set up your environment variables in your frontend:

Create a `.env.local` file (for local development):
```env
# Google Cloud Configuration
VITE_GCP_PROJECT_ID=haib-beauty-platform
VITE_GCP_REGION=us-central1
VITE_GCP_API_ENDPOINT=https://haib-api-[HASH]-uc.a.run.app
VITE_GCP_DATABASE_URL=postgresql://haib_user:[PASSWORD]@[DB_IP]:5432/haib_production

# API Configuration
VITE_API_URL=https://haib-api-[HASH]-uc.a.run.app/api

# Storage
VITE_STORAGE_BUCKET=haib-user-uploads
```

### For production deployment, set these in your hosting platform (Vercel, Netlify, etc.)

## 7. Authentication Setup

### Option 1: Google Identity Platform
```bash
gcloud services enable identitytoolkit.googleapis.com
```

### Option 2: Custom JWT Authentication
Implement your own JWT-based authentication in your Cloud Run API.

## 8. Monitoring and Logging

### Enable monitoring:
```bash
gcloud services enable monitoring.googleapis.com
gcloud services enable logging.googleapis.com
```

### Set up alerts for:
- Database connection issues
- API response times
- Error rates
- Storage usage

## 9. Security Best Practices

### IAM Roles:
```bash
# Create a service account for your API
gcloud iam service-accounts create haib-api-service

# Grant necessary permissions
gcloud projects add-iam-policy-binding haib-beauty-platform \
    --member="serviceAccount:haib-api-service@haib-beauty-platform.iam.gserviceaccount.com" \
    --role="roles/cloudsql.client"
```

### Network Security:
- Configure VPC firewall rules
- Use Cloud SQL private IP when possible
- Enable SSL/TLS for all connections

## 10. Cost Optimization

### Recommended settings for startup:
- Use `db-f1-micro` for database (can upgrade later)
- Set up Cloud Run with minimum instances = 0
- Use lifecycle policies for Cloud Storage
- Enable automatic backup retention policies

## 11. Deployment Pipeline

### Set up Cloud Build for CI/CD:
```yaml
# cloudbuild.yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/api:$COMMIT_SHA', '.']
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/api:$COMMIT_SHA']
  - name: 'gcr.io/cloud-builders/gcloud'
    args: [
      'run', 'deploy', 'haib-api',
      '--image', 'gcr.io/$PROJECT_ID/api:$COMMIT_SHA',
      '--region', 'us-central1',
      '--platform', 'managed'
    ]
```

## 12. Testing Your Setup

### Test database connection:
```bash
curl -X GET https://your-api-endpoint/api/health
```

### Test API endpoints:
```bash
# Test user registration
curl -X POST https://your-api-endpoint/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 13. Scaling Considerations

### Database scaling:
- Monitor connection pool usage
- Consider read replicas for heavy read operations
- Set up connection pooling (PgBouncer)

### API scaling:
- Cloud Run automatically scales based on demand
- Monitor cold start times
- Consider Cloud CDN for static assets

## Next Steps

1. **Run the database schema**: Execute `docs/database-schema.sql` on your Cloud SQL instance
2. **Deploy your API**: Build and deploy your backend API to Cloud Run
3. **Configure authentication**: Set up your preferred authentication method
4. **Test the connection**: Verify frontend can communicate with your GCP backend
5. **Set up monitoring**: Configure alerts and monitoring dashboards

## Support

For additional help:
- [Google Cloud Documentation](https://cloud.google.com/docs)
- [Cloud SQL Documentation](https://cloud.google.com/sql/docs)
- [Cloud Run Documentation](https://cloud.google.com/run/docs)

## Cost Estimation

Expected monthly costs for a startup (approximate):
- Cloud SQL (db-f1-micro): $7-15/month
- Cloud Run: $0-20/month (depends on usage)
- Cloud Storage: $1-5/month
- **Total**: ~$10-40/month for moderate usage