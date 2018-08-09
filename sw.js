const staticAssets = [
	'./',
	'./css/normalize.css',
	'./css/skeleton.css',
	'./app.js',
	'./fallback.json',
	'./images/sadpanda.gif'
];

// teste ...

self.addEventListener('install', async e => {
	console.log('SW install');

	const cache = await caches.open('pandanews-static');
	cache.addAll(staticAssets);
});

self.addEventListener('activate', function(event) {
	console.log('SW activate');

	event.waitUntil(
		caches.keys().then(function(cacheNames) {
			return Promise.all(
		  		cacheNames.filter(function(cacheName) {
					// Return true if you want to remove this cache,
					// but remember that caches are shared across
					// the whole origin
					return false;
		  		}).map(function(cacheName) {
					return caches.delete(cacheName);
		  		})
			);
		})
	);
});

self.addEventListener('fetch', e => {
	console.log('SW fetch');

	const req = e.request;
	const url = new URL(req.url);

	if (url.origin === location.origin) {
		e.respondWith(cacheFirst(req));
	} else {
		e.respondWith(networkFirst(req));
	}
});

async function cacheFirst(req) {
	const cachedResponse = await caches.match(req);
	return cachedResponse || fetch(req);
}

async function networkFirst(req) {
	const cache = await caches.open('pandanews-dynamic');

	try {
		const res = await fetch(req);
		cache.put(req, res.clone());
		return res;
	} catch (error) {
		const cachedResponse = await cache.match(req);
		return cachedResponse || await caches.match('./fallback.json');
	}
}
