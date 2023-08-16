(async () => {
  const entries = [];
  const projects = [
    {
      name: 'Website',
      link: 'https://github.com/Dec0deTeam/Dec0deTeam.github.io/',
      feed: 'https://www.incept.asia/github-atom.php?path=Dec0deTeam/Dec0deTeam.github.io/commits'
    }
  ];
  // get all entries from feeds
  for (const project of projects) {
    const response = await fetch(project.feed);
    const xml = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/xml');
    Array.from(
      xmlDoc.getElementsByTagName('entry')
    ).forEach(entry => {
      // Get's a single child element by tag name
      const t = (entry, tnames) => {
        let node = entry;
        tnames.forEach(tname => {
          node = node.getElementsByTagName(tname)[0];
        });
        return node;
      };
      entries.push({
        date: new Date(t(entry, [ 'updated' ]).textContent),
        project: project,
        message: t(entry, [ 'title' ]).textContent,
        author: t(entry, [ 'author', 'name' ]).textContent,
        link: t(entry, [ 'link' ]).getAttribute('href')
      });
    });
  }
  // sort entries by date
  entries.sort((a, b) => b.date - a.date);
  // render entries
  for (const entry of entries) {
    const article = document.createElement('article');
    article.className = 'entry';
    article.innerHTML = `
      <h3 class="title">
        <a href="${entry.project.link}" target="_blank">
          ${entry.project.name}
        </a>
      </h3>
      <p class="message">${entry.message}</p>
      <div class="meta">
        <div class="author">
          <img src="https://avatars.githubusercontent.com/${entry.author}" />
          <a href="https://github.com/${entry.author}" target="_blank">
            @${entry.author}
          </a>
        </div>
        <div class="timestamp">
          on
          <a href="${entry.link}" target="_blank">
            ${entry.date.toLocaleDateString('en-us', { 
              weekday:"long", 
              year:"numeric", 
              month:"short", 
              day:"numeric"
            })}
          </a>
        </div>
      </div>
    `;
    document.getElementById('feed').appendChild(article);
  }
})()