<?php
/**
 * 🎯 VERTEX Nexus Control Room Proxy v2
 * Proxy reverso otimizado para APIs JSON
 */

// Configurações
$vertex_server = 'http://localhost:3000';
$vertex_path = '/vertex/';

// Determinar a rota solicitada
$request_uri = $_SERVER['REQUEST_URI'];
$vertex_route = str_replace($vertex_path, '', $request_uri);

if ($vertex_route === '') {
    $vertex_route = '/';
}

// Identificar se é API (JSON) ou página HTML
$is_api = false;
$api_routes = ['/status', '/api/agents', '/api/metrics'];

foreach ($api_routes as $api_route) {
    if (strpos($vertex_route, $api_route) === 0) {
        $is_api = true;
        break;
    }
}

// URL alvo
$target_url = $vertex_server . $vertex_route;

// Headers iniciais
if ($is_api) {
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
} else {
    header('Content-Type: text/html; charset=UTF-8');
}

header('X-VERTEX-Proxy: v2.0');
header('X-VERTEX-Integration: DOMAIN-PROXY-ACTIVE');

// Se for requisição OPTIONS (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Verificar se o servidor VERTEX está online
$ch = curl_init($vertex_server . '/status');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 3);
curl_setopt($ch, CURLOPT_NOBODY, true);
curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($http_code !== 200) {
    // Servidor offline
    if ($is_api) {
        http_response_code(503);
        echo json_encode([
            'error' => 'VERTEX Control Room temporarily offline',
            'status' => 'maintenance',
            'expected_completion' => '5-10 minutes',
            'system_status' => '9/9 Agents Complete | ROI: 376x | Risk: 6/20 LOW',
            'timestamp' => date('c')
        ]);
    } else {
        // Página HTML de fallback
        ?>
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>🎯 VERTEX Nexus - System Maintenance</title>
            <style>
                :root { --vertex-blue: #0ea5e9; --vertex-purple: #8b5cf6; --vertex-dark: #0f172a; }
                body { background: var(--vertex-dark); color: white; font-family: 'Segoe UI', sans-serif; margin: 0; padding: 2rem; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
                .container { text-align: center; max-width: 600px; }
                .logo { font-size: 3rem; font-weight: 700; background: linear-gradient(90deg, var(--vertex-blue), var(--vertex-purple)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 1rem; }
                .status { background: rgba(239, 68, 68, 0.1); color: #ef4444; padding: 1rem; border-radius: 1rem; border: 1px solid #ef4444; margin: 2rem 0; }
                .info { color: #94a3b8; line-height: 1.6; }
                .link { display: inline-block; margin-top: 2rem; padding: 1rem 2rem; background: var(--vertex-blue); color: white; text-decoration: none; border-radius: 0.75rem; font-weight: 600; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="logo">VERTEX Nexus</div>
                <div class="status">⚠️ VERTEX Control Room is temporarily offline for maintenance</div>
                <div class="info">
                    <p>The VERTEX Control Room is currently being integrated into the main domain.</p>
                    <p>Expected completion: 5-10 minutes</p>
                    <p>System Status: 9/9 Agents Complete | ROI: 376x | Risk: 6/20 LOW</p>
                </div>
                <a href="/" class="link">Return to Status Page</a>
            </div>
        </body>
        </html>
        <?php
    }
    exit;
}

// Servidor online - fazer proxy
$ch = curl_init($target_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
curl_setopt($ch, CURLOPT_HEADER, true);

// Preservar alguns headers da requisição original
$headers = [];
if (isset($_SERVER['HTTP_ACCEPT'])) {
    $headers[] = 'Accept: ' . $_SERVER['HTTP_ACCEPT'];
}
if (isset($_SERVER['HTTP_ACCEPT_LANGUAGE'])) {
    $headers[] = 'Accept-Language: ' . $_SERVER['HTTP_ACCEPT_LANGUAGE'];
}

curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

$response = curl_exec($ch);
$header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$response_headers = substr($response, 0, $header_size);
$body = substr($response, $header_size);

$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Definir código HTTP
http_response_code($http_code);

// Processar headers da resposta
$header_lines = explode("\n", $response_headers);
foreach ($header_lines as $header) {
    $header = trim($header);
    if (empty($header) || strpos($header, 'HTTP/') === 0) {
        continue;
    }
    
    // Não repassar alguns headers
    if (stripos($header, 'Content-Length:') === 0) {
        continue;
    }
    if (stripos($header, 'Transfer-Encoding:') === 0) {
        continue;
    }
    if (stripos($header, 'Connection:') === 0) {
        continue;
    }
    
    // Para APIs JSON, garantir content-type correto
    if ($is_api && stripos($header, 'Content-Type:') === 0) {
        header('Content-Type: application/json');
        continue;
    }
    
    header($header);
}

// Para páginas HTML, ajustar URLs
if (!$is_api) {
    $body = str_replace('href="/', 'href="/vertex/', $body);
    $body = str_replace('src="/', 'src="/vertex/', $body);
    $body = str_replace('action="/', 'action="/vertex/', $body);
    $body = str_replace('http://localhost:3000', 'https://nexusdigital.orquestracrm.com.br/vertex', $body);
    $body = str_replace('http://191.252.179.78:3000', 'https://nexusdigital.orquestracrm.com.br/vertex', $body);
    
    // Adicionar banner de integração
    $integration_banner = '
    <div style="position: fixed; top: 10px; right: 10px; background: rgba(14, 165, 233, 0.9); color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; font-size: 0.8rem; z-index: 9999; border: 1px solid rgba(255, 255, 255, 0.2);">
        🎯 VERTEX Integrated v2.0
    </div>
    ';
    
    $body = str_replace('</body>', $integration_banner . '</body>', $body);
}

// Output
echo $body;
?>