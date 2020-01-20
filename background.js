const stUrl = 'https://www.steamtrades.com/messages';

// permalinks of comments we already notified the user of
let permalinks = [];

chrome.alarms.onAlarm.addListener(function() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', stUrl);
    xhr.responseType = 'document';
    xhr.send();
    xhr.onload = function() {
        if (xhr.status != 200) {
            console.log(`Error opening page ${stUrl}`);
            return;
        }

        let comments = xhr.response.getElementsByClassName("comment_inner");
        for (i = 0; i < comments.length; ++i) {
            let unread = comments[i].getElementsByClassName("comment_unread")
            if (unread.length == 0)
                // break on first read comment
                break;
            let links = comments[i].getElementsByTagName("a");
            let permalink = links[links.length - 1].getAttribute('href');
            if (permalinks.includes(permalink))
                continue;
            let author = comments[i].getElementsByClassName("author_name")[0].innerText.trim();
            let message = comments[i].getElementsByClassName("comment_body_default markdown")[0].innerText.trim();
            permalinks.push(permalink);
            chrome.notifications.create('', {title: `New message from ${author}`, message: message, type: 'basic', iconUrl: 'images/icon64.png'});
        }
    }
});

chrome.alarms.create('STHelper', {when: Date.now(), periodInMinutes: 5});
