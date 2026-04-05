<?php
/**
 * 🎯 VERTEX Nexus Control Room Proxy
 * Proxy reverso para integrar sala VERTEX no domínio principal
 * URL: https://nexusdigital.orquestracrm.com.br/vertex/
 */

header('Content-Type: text/html');
header('X-VERTEX-Proxy: v1.1.0');
header('Access-Control-Allow-Origin: *');

// Configurações
$vertex_server = 'http://localhost:3000';
$vertex_path = '/vertex/';

// Determinar a rota solicitada
$request_uri = $_SERVER['REQUEST_URI'];
$vertex_route = str_replace($vertex_path, '', $request_uri);

if ($vertex_route === '') {
    $vertex_route = '/';
}

// Rotas especiais
$special_routes = [
    '/status' => '/status',
    '/api/agents' => '/api/agents',
    '/api/metrics' => '/api/metrics'
];

if (isset($special_routes[$vertex_route])) {
    $target_url = $vertex_server . $special_routes[$vertex_route];
    // Para APIs, manter content-type JSON
    header('Content-Type: application/json');
} else {
    $target_url = $vertex_server . $vertex_route;
}

// Função para fazer a requisição
function fetchVertexContent($url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_HEADER, true);
    
    // Headers para simular navegador
    $headers = [
        'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
        'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language: en-US,en;q=0.5',
        'Accept-Encoding: gzip, deflate',
        'Connection: keep-alive',
        'Upgrade-Insecure-Requests: 1',
    ];
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    
    $response = curl_exec($ch);
    $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    $headers = substr($response, 0, $header_size);
    $body = substr($response, $header_size);
    
    curl_close($ch);
    
    return ['headers' => $headers, 'body' => $body];
}

// Verificar se o servidor VERTEX está online
$status_check = @file_get_contents($vertex_server . '/status', false, stream_context_create([
    'http' => ['timeout' => 2]
]));

if ($status_check === FALSE) {
    // Servidor offline - mostrar página de fallback
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
    exit;
}

// Buscar conteúdo do VERTEX
$result = fetchVertexContent($target_url);

// Processar headers
$header_lines = explode("\n", $result['headers']);
foreach ($header_lines as $header) {
    if (strpos($header, 'Content-Type:') === 0) {
        header($header);
    }
    if (strpos($header, 'Location:') === 0) {
        // Redirecionar URLs relativas para o path /vertex/
        $location = trim(substr($header, 9));
        if (strpos($location, '/') === 0 && strpos($location, 'http') !== 0) {
            $location = '/vertex' . $location;
        }
        header('Location: ' . $location);
        exit;
    }
}

// Adicionar header personalizado
header('X-VERTEX-Integration: DOMAIN-PROXY-ACTIVE');

// Substituir URLs no conteúdo para apontar para /vertex/
$body = $result['body'];
$body = str_replace('href="/', 'href="/vertex/', $body);
$body = str_replace('src="/', 'src="/vertex/', $body);
$body = str_replace('action="/', 'action="/vertex/', $body);
$body = str_replace('http://localhost:3000', 'https://nexusdigital.orquestracrm.com.br/vertex', $body);
$body = str_replace('http://191.252.179.78:3000', 'https://nexusdigital.orquestracrm.com.br/vertex', $body);

// Adicionar banner de integração
$integration_banner = '
<div style="position: fixed; top: 10px; right: 10px; background: rgba(14, 165, 233, 0.9); color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; font-size: 0.8rem; z-index: 9999; border: 1px solid rgba(255, 255, 255, 0.2);">
    🎯 VERTEX Integrated v1.1.0
</div>
';

$body = str_replace('</body>', $integration_banner . '</body>', $body);

// Output do conteúdo
echo $body;
?>