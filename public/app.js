document.querySelector('#btnSearch').addEventListener("click", sendWord)

async function sendWord() {    
    const search = document.getElementById('search').value; 
    const list = document.getElementById('fill_list');

    fetch("/extract-phrase", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },    
        body: JSON.stringify({word: search})
    }).then(response => {
        return response.json();
    }).then(data => {
        data.forEach(item => {
            let li = document.createElement("li");
            let node = document.createTextNode(item);
            li.appendChild(node);
            list.appendChild(li);
        });
    });   
}    


