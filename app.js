const apikey = 'ca4803b9ae004bfc9f6a91e83bbccaa1';
const main = document.querySelector('main');
const sourceSelector = document.querySelector('#sourceSelector');
const defaultSource = 'the-washington-post';

window.addEventListener('load', async e => {
	updateNews();
	await updateSources();

	sourceSelector.value = defaultSource;

	sourceSelector.addEventListener('change', e => {
		updateNews(e.target.value);
	});

	if ('serviceWorker' in navigator) {
		try {
			navigator.serviceWorker.register('sw.js');
			console.log('SW register success');
		} catch (error) {
			console.log('SW register failed');
		}
	}
});

async function updateNews(source = defaultSource) {
	const res = await fetch(`https://newsapi.org/v2/top-headlines?sources=${source}&apiKey=${apikey}`);
	const json = await res.json();

	main.innerHTML = json.articles.map(createArticle).join('\n');
}

async function updateSources() {
	const res = await fetch(`https://newsapi.org/v2/sources?apiKey=${apikey}`);
	const json = await res.json();

	sourceSelector.innerHTML = json.sources.map(src => `<option value="${src.id}">${src.name}</option>`).join('\n');
}

function createArticle(article) {
	return `<div class="row">
		<div class="one-half column">
			<h4>${article.title}</h4>
			<a href="${article.url}">Veja mais</a>
			<img src="${article.urlToImage}" width="600" heigth="200">
			<p>${article.description}</p>
		</div>
	</div>`;
}