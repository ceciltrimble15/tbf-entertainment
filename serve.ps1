$ErrorActionPreference = 'SilentlyContinue'
$root = 'C:\Users\Owner\Desktop\a1-creative-website'
$port = 5173

$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host "Serving http://localhost:$port"
[Console]::Out.Flush()

while ($true) {
    $ctx = $listener.GetContext()
    $path = $ctx.Request.Url.AbsolutePath.TrimStart('/')
    if ($path -eq '' -or $path -eq '/') { $path = 'standalone.html' }
    $file = Join-Path $root $path
    $resp = $ctx.Response
    $resp.Headers.Add('Cache-Control','no-cache')
    if (Test-Path $file -PathType Leaf) {
        $bytes = [System.IO.File]::ReadAllBytes($file)
        $ext = [System.IO.Path]::GetExtension($file).ToLower()
        $resp.ContentType = if ($ext -eq '.html') { 'text/html; charset=utf-8' }
                            elseif ($ext -eq '.js') { 'application/javascript' }
                            elseif ($ext -eq '.css') { 'text/css' }
                            else { 'application/octet-stream' }
        $resp.StatusCode = 200
        $resp.ContentLength64 = $bytes.LongLength
        $resp.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $resp.StatusCode = 404
    }
    $resp.Close()
}
