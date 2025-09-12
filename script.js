// ===================================================================================
// ÁREA DE CONTEÚDO - É AQUI QUE VOCÊ VAI ADICIONAR SUAS INFORMAÇÕES
// ===================================================================================

const arcaneKnowledge = {
    password: "segredo", // Senha para conteúdo restrito
    categories: [
        {
            title: "Eventos Históricos",
            isRestricted: false,
            articles: [
                {
                    id: "Causalidade Ocorrida em 1993",
                    title: "A Batalha de Babylon Hill",
                    content: `
                        <div class="infobox">
                            <h3>Batalha de Babylon Hill</h3>
                            <img src="https://i.imgur.com/example.png" alt="Pintura da batalha">
                            <p class="caption">Uma representação artística do confronto.</p>
                            <p><strong>Data:</strong> 7 de Setembro de 1950</p>
                            <p><strong>Local:</strong> Sudoeste da Inglaterra</p>
                            <p><strong>Beligerantes:</strong> Forças de Royaka vs. Exército de Kanlipbentenan</p>
                        </div>
                        <p>A <strong>Batalha de Babylon Hill</strong> foi um confronto significativo durante a Primeira Guerra de Obri, ocorrido em 7 de Setembro de 1950. O conflito se deu entre as forças de Royaka e o exército de Kanlipbentenan no sudoeste da Inglaterra.</p>
                        <p>Este evento é um ponto crucial na história, pois redefiniu as táticas de guerra da época e marcou o início do uso de batedores "Shaftrame" para reconhecimento. O custo estimado da operação foi de $30 granzailis, uma soma considerável para o período.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.</p>
                    `
                },
                {
                    id: "o-primeiro-reinado",
                    title: "O Primeiro Reinado",
                    content: `<h1>O Primeiro Reinado</h1><p>Detalhes sobre a ascensão e queda do primeiro grande império do continente.</p>`
                }
            ]
        },
        {
            title: "Conhecimento Restrito",
            isRestricted: true,
            articles: [
                {
                    id: "alquimia-avancada",
                    title: "Alquimia Avançada",
                    content: `<h1>Segredos da Alquimia</h1><p>Acesso concedido. Aqui estão as fórmulas para a transmutação de metais básicos em ouro...</p>`
                }
            ]
        },
        {
            title: "Sobre o Projeto",
            isRestricted: false,
            articles: [
                {
                    id: "sobre-a-arca",
                    title: "Sobre a Arca",
                    content: `<h1>Sobre a A.A.K.</h1><p>Este projeto serve como um repositório pessoal de conhecimento, ficção e anotações.</p>`
                }
            ]
        }
    ]
};

// ===================================================================================
// LÓGICA DO SITE - Não precisa mexer abaixo desta linha
// ===================================================================================

document.addEventListener('DOMContentLoaded', ( ) => {
    const sideNav = document.getElementById('side-nav');
    const mainContent = document.getElementById('main-content');
    const homeLink = document.getElementById('home-link');
    const unlockedCategories = new Set();

    function renderNav() {
        sideNav.innerHTML = '';
        arcaneKnowledge.categories.forEach(category => {
            const categoryTitle = document.createElement('h3');
            categoryTitle.textContent = category.title;
            sideNav.appendChild(categoryTitle);

            const articleList = document.createElement('ul');
            category.articles.forEach(article => {
                const listItem = document.createElement('li');
                const link = document.createElement('a');
                link.href = `#${article.id}`;
                link.textContent = article.title + (category.isRestricted ? ' 🔒' : '');
                link.dataset.articleId = article.id;
                listItem.appendChild(link);
                articleList.appendChild(listItem);
            });
            sideNav.appendChild(articleList);
        });
    }

    function renderArticle(articleId) {
        mainContent.innerHTML = '';
        let article, category;
        for (const cat of arcaneKnowledge.categories) {
            const foundArticle = cat.articles.find(art => art.id === articleId);
            if (foundArticle) {
                article = foundArticle;
                category = cat;
                break;
            }
        }

        if (!article) {
            mainContent.innerHTML = '<h1>Artigo não encontrado</h1><p>O artigo que você procura não existe ou foi movido.</p>';
            return;
        }

        if (category.isRestricted && !unlockedCategories.has(category.title)) {
            renderPasswordGate(category, article.id);
            return;
        }

        mainContent.innerHTML = `<h1 class="article-title">${article.title}</h1>${article.content}`;
        
        document.querySelectorAll('#side-nav a').forEach(a => a.classList.remove('active'));
        const activeLink = document.querySelector(`#side-nav a[data-article-id="${articleId}"]`);
        if (activeLink) activeLink.classList.add('active');
    }

    function renderPasswordGate(category, targetArticleId) {
        mainContent.innerHTML = `
            <h1>Acesso Restrito</h1>
            <p>O conteúdo em "${category.title}" é protegido. Por favor, insira a senha para continuar.</p>
            <div class="password-gate">
                <input type="password" id="password-input" placeholder="Senha...">
                <button id="password-submit">Desbloquear</button>
            </div>
        `;
        document.getElementById('password-submit').addEventListener('click', () => {
            const input = document.getElementById('password-input');
            if (input.value === arcaneKnowledge.password) {
                unlockedCategories.add(category.title);
                renderArticle(targetArticleId);
            } else {
                input.style.borderColor = 'red';
                alert('Senha incorreta.');
            }
        });
    }

    sideNav.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            const articleId = e.target.dataset.articleId;
            window.history.pushState({ articleId }, '', `#${articleId}`);
            renderArticle(articleId);
        }
    });

    homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        const firstArticleId = arcaneKnowledge.categories[0].articles[0].id;
        window.history.pushState({ articleId: firstArticleId }, '', `#${firstArticleId}`);
        renderArticle(firstArticleId);
    });

    window.addEventListener('popstate', (e) => {
        const articleId = e.state?.articleId || window.location.hash.substring(1) || arcaneKnowledge.categories[0].articles[0].id;
        renderArticle(articleId);
    });

    function initialLoad() {
        const articleId = window.location.hash.substring(1) || arcaneKnowledge.categories[0].articles[0].id;
        window.history.replaceState({ articleId }, '', `#${articleId}`);
        renderArticle(articleId);
    }

    renderNav();
    initialLoad();
});
