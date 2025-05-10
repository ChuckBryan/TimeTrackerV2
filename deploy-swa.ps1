# Script to deploy TimeTracker using Azure Static Web Apps CLI
# This addresses the "waiting to deploy" issue

# Check if the SWA CLI is installed
if (-not (Get-Command swa -ErrorAction SilentlyContinue)) {
    Write-Host "Azure Static Web Apps CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g @azure/static-web-apps-cli
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install Azure Static Web Apps CLI. Please install manually with:" -ForegroundColor Red
        Write-Host "npm install -g @azure/static-web-apps-cli" -ForegroundColor Red
        exit 1
    }
}

# Ensure we're logged in
Write-Host "Checking Azure login status..." -ForegroundColor Cyan
az account show > $null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Not logged in to Azure. Please login:" -ForegroundColor Yellow
    az login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to login to Azure. Please try again manually." -ForegroundColor Red
        exit 1
    }
}

# Define the deployment parameters
$appName = "timetracker"
$resourceGroup = "timetracker-rg"
$location = "westus2" # Using the location we identified from the list command
$environment = "Production" # Use 'Production' instead of preview/staging

# First, let's verify the app exists
Write-Host "Verifying Static Web App exists..." -ForegroundColor Cyan
$app = az staticwebapp show --name $appName --resource-group $resourceGroup 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Static Web App '$appName' not found in resource group '$resourceGroup'." -ForegroundColor Red
    Write-Host "Creating new Static Web App..." -ForegroundColor Yellow
    
    az staticwebapp create --name $appName --resource-group $resourceGroup --location $location --sku Free
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to create Static Web App. Please check your permissions and try again." -ForegroundColor Red
        exit 1
    }
}

# Deploy with the SWA CLI using direct mode
Write-Host "Deploying TimeTracker to Azure Static Web App..." -ForegroundColor Cyan
Write-Host "Using forceful deployment to resolve 'waiting to deploy' issue..." -ForegroundColor Yellow

swa deploy `
    --app-name $appName `
    --resource-group $resourceGroup `
    --env $environment `
    --deployment-token (az staticwebapp secrets list --name $appName --resource-group $resourceGroup --query "properties.apiKey" -o tsv) `
    --output-location . `
    --verbose

if ($LASTEXITCODE -ne 0) {
    Write-Host "Deployment failed. Trying alternative approach..." -ForegroundColor Yellow
    
    Write-Host "Attempting direct upload deployment..." -ForegroundColor Cyan
    # Alternative approach using another deployment method
    swa deploy . `
        --deployment-token (az staticwebapp secrets list --name $appName --resource-group $resourceGroup --query "properties.apiKey" -o tsv) `
        --env $environment
}

# Check deployment status
if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Green
    Write-Host "  TimeTracker deployed successfully!" -ForegroundColor Green
    Write-Host "================================================" -ForegroundColor Green
    
    # Get the URL
    $url = az staticwebapp show --name $appName --resource-group $resourceGroup --query "defaultHostname" -o tsv
    Write-Host "Your app is available at: https://$url" -ForegroundColor Cyan
    
    # Open the URL in the default browser
    Write-Host "Opening app in browser..." -ForegroundColor Yellow
    Start-Process "https://$url"
} else {
    Write-Host ""
    Write-Host "Deployment encountered issues." -ForegroundColor Red
    Write-Host "You may need to check the Azure portal for more details." -ForegroundColor Yellow
}
