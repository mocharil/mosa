# Deployment Guide - Voice JKN Agent

## Docker Deployment

### Prerequisites
- Docker installed (v20.10 or higher)
- Docker Compose installed (v2.0 or higher)

### Quick Start

#### 1. Build Docker Image
```bash
docker build -t voice-jkn-agent:latest .
```

#### 2. Run with Docker
```bash
docker run -p 3000:3000 \
  -e GEMINI_API_KEY=your_api_key_here \
  voice-jkn-agent:latest
```

#### 3. Run with Docker Compose
```bash
docker-compose up -d
```

### Environment Variables

Create a `.env.production` file with the following variables:

```env
# Application
NODE_ENV=production
PORT=3000

# API Keys
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_CLOUD_PROJECT=your_project_id

# Optional
NEXT_PUBLIC_APP_NAME=Voice JKN Agent
```

### Build Arguments

You can pass build arguments during the build process:

```bash
docker build \
  --build-arg NEXT_PUBLIC_APP_NAME="Custom App Name" \
  -t voice-jkn-agent:latest .
```

### Production Deployment

#### Using Docker Compose with Environment File

1. Create `.env.production` file with your environment variables
2. Update `docker-compose.yml` to uncomment the `env_file` section
3. Run:
```bash
docker-compose --env-file .env.production up -d
```

#### View Logs
```bash
# Docker
docker logs -f voice-jkn-agent

# Docker Compose
docker-compose logs -f
```

#### Stop Container
```bash
# Docker
docker stop voice-jkn-agent

# Docker Compose
docker-compose down
```

#### Restart Container
```bash
# Docker
docker restart voice-jkn-agent

# Docker Compose
docker-compose restart
```

### Health Check

The application includes a health check endpoint. Access it at:
```
http://localhost:3000/api/health
```

### Multi-Stage Build Benefits

The Dockerfile uses a multi-stage build process:
1. **deps**: Installs production dependencies
2. **builder**: Builds the Next.js application
3. **runner**: Creates the final minimal image

This results in:
- Smaller image size (~200-300MB vs 1GB+)
- Better security (minimal attack surface)
- Faster deployment times

### Troubleshooting

#### Container doesn't start
Check logs:
```bash
docker logs voice-jkn-agent
```

#### Port already in use
Change the port mapping in `docker-compose.yml` or use different port:
```bash
docker run -p 8080:3000 voice-jkn-agent:latest
```

#### Build fails
Clear Docker cache and rebuild:
```bash
docker build --no-cache -t voice-jkn-agent:latest .
```

### Security Notes

1. Never commit `.env` files with sensitive data
2. Use Docker secrets for production deployments
3. The container runs as non-root user (nextjs:nodejs)
4. Keep the base image updated regularly

### Cloud Deployment

#### Google Cloud Run
```bash
# Build and push to Google Container Registry
gcloud builds submit --tag gcr.io/PROJECT_ID/voice-jkn-agent

# Deploy to Cloud Run
gcloud run deploy voice-jkn-agent \
  --image gcr.io/PROJECT_ID/voice-jkn-agent \
  --platform managed \
  --region asia-southeast2 \
  --allow-unauthenticated
```

#### AWS ECS / Fargate
1. Push image to ECR
2. Create task definition
3. Create service with task definition

#### Azure Container Instances
```bash
az container create \
  --resource-group myResourceGroup \
  --name voice-jkn-agent \
  --image voice-jkn-agent:latest \
  --dns-name-label voice-jkn-agent \
  --ports 3000
```

### Monitoring

Consider adding monitoring tools:
- Prometheus for metrics
- Grafana for visualization
- Sentry for error tracking
- New Relic or DataDog for APM

### Scaling

For horizontal scaling, use:
- Kubernetes (K8s)
- Docker Swarm
- Cloud-native solutions (Cloud Run, ECS, AKS)
