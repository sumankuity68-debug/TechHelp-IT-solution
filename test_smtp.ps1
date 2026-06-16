# Test 1: Register a brand new user (tests SMTP email sending)
Write-Host "=== TEST 1: Registering new user ===" -ForegroundColor Cyan
$timestamp = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$testEmail = "smtptest$timestamp@yopmail.com"
Write-Host "Using email: $testEmail"

$body = "{`"name`":`"Test User`",`"email`":`"$testEmail`",`"phone`":`"+1234567890`",`"password`":`"test123456`",`"role`":`"user`"}"
try {
    $response = Invoke-RestMethod `
        -Uri "https://techhelp-backend.onrender.com/api/auth/register" `
        -Method POST `
        -Body $body `
        -ContentType "application/json"
    Write-Host "REGISTER SUCCESS:" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json)
    
    # Test 2: Try to login WITHOUT verifying email (should be blocked)
    Write-Host "`n=== TEST 2: Login WITHOUT email verification (should be blocked) ===" -ForegroundColor Cyan
    $loginBody = "{`"email`":`"$testEmail`",`"password`":`"test123456`"}"
    try {
        $loginResp = Invoke-RestMethod `
            -Uri "https://techhelp-backend.onrender.com/api/auth/login" `
            -Method POST `
            -Body $loginBody `
            -ContentType "application/json"
        Write-Host "LOGIN RESPONSE:" ($loginResp | ConvertTo-Json)
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $loginErrBody = $reader.ReadToEnd()
        Write-Host "LOGIN BLOCKED ($statusCode) - CORRECT:" $loginErrBody -ForegroundColor Yellow
    }
    
    # Test 3: Resend verification email
    Write-Host "`n=== TEST 3: Resend verification email ===" -ForegroundColor Cyan
    $resendBody = "{`"email`":`"$testEmail`"}"
    try {
        $resendResp = Invoke-RestMethod `
            -Uri "https://techhelp-backend.onrender.com/api/auth/resend-verification" `
            -Method POST `
            -Body $resendBody `
            -ContentType "application/json"
        Write-Host "RESEND SUCCESS:" -ForegroundColor Green
        Write-Host ($resendResp | ConvertTo-Json)
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $resendErrBody = $reader.ReadToEnd()
        Write-Host "RESEND FAILED ($statusCode):" $resendErrBody -ForegroundColor Red
    }
    
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    $responseBody = $reader.ReadToEnd()
    Write-Host "REGISTER FAILED ($statusCode): $responseBody" -ForegroundColor Red
}
