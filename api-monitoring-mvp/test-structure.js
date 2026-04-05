// Simple structure test
const fs = require('fs');
const path = require('path');

console.log('📁 API Monitoring MVP Structure Test\n');

const requiredFiles = [
  'package.json',
  'server.js',
  'config/database.js',
  'models/monitoring.js',
  'models/alert.js',
  'routes/api.js',
  'routes/monitor.js',
  'routes/dashboard.js',
  'services/monitorService.js',
  'public/dashboard.html',
  'README.md',
  '.env.example'
];

let allPassed = true;

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allPassed = false;
  }
});

console.log('\n📦 Checking package.json...');
try {
  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  
  const requiredDeps = ['express', 'axios', 'cors', 'dotenv', 'node-cron'];
  const requiredDevDeps = ['nodemon'];
  
  console.log('Dependencies:');
  requiredDeps.forEach(dep => {
    if (pkg.dependencies && pkg.dependencies[dep]) {
      console.log(`  ✅ ${dep}: ${pkg.dependencies[dep]}`);
    } else {
      console.log(`  ❌ ${dep} - MISSING`);
      allPassed = false;
    }
  });
  
  console.log('\nDev Dependencies:');
  requiredDevDeps.forEach(dep => {
    if (pkg.devDependencies && pkg.devDependencies[dep]) {
      console.log(`  ✅ ${dep}: ${pkg.devDependencies[dep]}`);
    } else {
      console.log(`  ⚠️  ${dep} - Optional, but recommended`);
    }
  });
  
  console.log('\n📋 Checking scripts...');
  const requiredScripts = ['start', 'dev'];
  requiredScripts.forEach(script => {
    if (pkg.scripts && pkg.scripts[script]) {
      console.log(`  ✅ ${script}: ${pkg.scripts[script]}`);
    } else {
      console.log(`  ❌ ${script} - MISSING`);
      allPassed = false;
    }
  });
  
} catch (error) {
  console.log(`❌ Error reading package.json: ${error.message}`);
  allPassed = false;
}

console.log('\n🔍 Checking server.js structure...');
try {
  const serverContent = fs.readFileSync(path.join(__dirname, 'server.js'), 'utf8');
  const checks = [
    { name: 'Express import', regex: /require\('express'\)/ },
    { name: 'CORS middleware', regex: /require\('cors'\)/ },
    { name: 'Database connection', regex: /require\('\.\/config\/database'\)/ },
    { name: 'Routes import', regex: /require\('\.\/routes\// },
    { name: 'Server listen', regex: /app\.listen\(/ },
    { name: 'Monitor service', regex: /require\('\.\/services\/monitorService'\)/ }
  ];
  
  checks.forEach(check => {
    if (check.regex.test(serverContent)) {
      console.log(`  ✅ ${check.name}`);
    } else {
      console.log(`  ⚠️  ${check.name} - Not found`);
    }
  });
  
} catch (error) {
  console.log(`❌ Error reading server.js: ${error.message}`);
  allPassed = false;
}

console.log('\n🎯 Summary:');
if (allPassed) {
  console.log('✅ All critical components are present!');
  console.log('\nTo run the application:');
  console.log('1. cd /root/.openclaw/workspace/api-monitoring-mvp');
  console.log('2. npm install');
  console.log('3. cp .env.example .env');
  console.log('4. npm run dev');
  console.log('\nDashboard will be available at: http://localhost:3000/dashboard.html');
} else {
  console.log('⚠️  Some components are missing or incomplete.');
  console.log('Please check the missing files above.');
}

process.exit(allPassed ? 0 : 1);