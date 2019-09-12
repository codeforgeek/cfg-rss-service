const Feed = require('rss');
const fs = require('fs');
const path = require('path');
const nconf = require('nconf');
const models = require('./models');

function generateRss() {
    models.getAllArticles((err, articles) => {
        if(err) {
            console.log('error generating rss feed');
            // send email or something
            return;
        }        
        // generate rss feed
        const feed = new Feed({
            title: "Codeforgeek",
            description: "Web technologies and programming tutorials",
            site_url: "https://codeforgeek.com",
            language: "en-US",
            generator: "Rss Generator Microservice - Codeforgeek",
            pubDate: new Date(),
            feed_url: "https://codeforgeek.com/feed/"    
        });

        articles.forEach(post => {
            feed.item({
                title: post.title,
                url: post.url,
                description: post.excerpt,
                content: post.content,
                date: new Date(post.date),
                enclosure: {url: post.featured_image},
                categories: post.categories.map(singleCategory => { return singleCategory.name }),
                author: post.authorData[0].name
            });        
        });

        fs.writeFileSync(path.join(nconf.get('rssPath'), 'feed.xml'), feed.xml());
        console.log('Generated RSS feed.');
    });
}

module.exports = {
    generateRss: generateRss,
}