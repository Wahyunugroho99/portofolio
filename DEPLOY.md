# Deploy to Google Cloud Run

This app is a React + Express app. Deploy it to Cloud Run so `/api/upload` can run on the server.

## 1. Prepare Google Cloud

```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com storage.googleapis.com
```

## 2. Create a Storage Bucket

Use a globally unique bucket name.

```bash
gcloud storage buckets create gs://YOUR_BUCKET_NAME --location=asia-southeast2 --uniform-bucket-level-access
gcloud storage buckets add-iam-policy-binding gs://YOUR_BUCKET_NAME --member=allUsers --role=roles/storage.objectViewer
```

The upload API returns public `https://storage.googleapis.com/...` URLs, so the bucket needs public object read access.

## 3. Deploy

```bash
gcloud run deploy portfolio \
  --source . \
  --region asia-southeast2 \
  --allow-unauthenticated \
  --set-env-vars GCS_BUCKET_NAME=YOUR_BUCKET_NAME
```

## 4. Check the App

```bash
curl https://YOUR_CLOUD_RUN_URL/api/health
```

Then open the Cloud Run URL, upload an image in AdminPortal, and confirm the returned image URL still works after a redeploy.
