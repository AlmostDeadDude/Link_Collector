//global var to store the fetched results
let RESULTS = [];

//default demo data used when backend is unavailable or empty
const DEFAULT_TAGS = ['javascript', 'css', 'api', 'design', 'learning', 'productivity'];
const DEFAULT_CATS = ['Frontend fundamentals', 'Practice & tutorials', 'APIs & backend', 'Design & inspiration', 'Career & learning paths', 'Reading list'];
const DEFAULT_COLLECTION = [
    { linkID: 'demo-1', linkURL: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox', linkCATEGORY: 'Frontend fundamentals', linkTAGS: '-css-layout-reference-', linkDATE: '12-03-2024' },
    { linkID: 'demo-2', linkURL: 'https://javascript30.com/', linkCATEGORY: 'Practice & tutorials', linkTAGS: '-javascript-challenge-video-', linkDATE: '05-02-2024' },
    { linkID: 'demo-3', linkURL: 'https://www.postman.com/explore', linkCATEGORY: 'APIs & backend', linkTAGS: '-api-testing-collections-', linkDATE: '18-01-2024' },
    { linkID: 'demo-4', linkURL: 'https://www.figma.com/community', linkCATEGORY: 'Design & inspiration', linkTAGS: '-ui-components-community-', linkDATE: '10-12-2023' }
];

//global var to store validation results
let VALIDATION = {
    url: false,
    cat: false,
    tags: false,
    reset() {
        this.url = false;
        this.cat = false;
        this.tags = false;
    }
}

//global var for info message status
let MSG_STATUS = false;

//functions
const synchroTags = (inp, opts) => {
    //arguments are DOM elements
    //inp is the <input>
    //opts is the <div> with class 'existing-tags' containing <div>s with class 'existing-tag'
    //output not required

    //when user inputs the tags in inp, the matching options are highlighted
    inp.addEventListener('input', function () {
        let val = this.value;

        //after user input each letter, check if any existing tags match whole word
        let inputString = val.toLowerCase();
        //find comma separated tags
        let tags = inputString.split(',');
        //check if any of the tags match any of the options
        let matches = [];
        for (let i = 0; i < tags.length; i++) {
            for (let j = 0; j < opts.children.length; j++) {
                if (opts.children[j].innerText.toLowerCase() === tags[i].trim()) {
                    matches.push(opts.children[j]);
                }
            }
        }

        //highlight matching options
        for (let k = 0; k < opts.children.length; k++) {
            if (matches.includes(opts.children[k])) {
                opts.children[k].classList.add('selected');
            } else {
                opts.children[k].classList.remove('selected');
            }
        }
    });

    // when user selects/deselects an option, the inp is updated and validated
    [...opts.children].forEach(opt => {
        opt.addEventListener('click', function () {
            if (this.classList.contains('selected')) {
                this.classList.remove('selected');
                //also remove the tag from the input
                let tag = this.innerText;
                let tags = inp.value.split(',');
                let newTags = [];
                for (let i = 0; i < tags.length; i++) {
                    if (tags[i].trim() !== tag) {
                        newTags.push(tags[i].trim());
                    }
                }
                inp.value = newTags.join(',');
            } else {
                this.classList.add('selected');
                //add the tag to the input
                let tag = this.innerText;
                let inpval = inp.value.trim();
                //if there is a comma in the last position, remove it
                if (inpval.charAt(inpval.length - 1) === ',') {
                    inpval = inpval.slice(0, inpval.length - 1);
                }
                let tags = inpval.split(',');
                tags.push(tag);
                inp.value = tags.join(',');
            }
            //in both cases remove the comma if it is the first letter
            if (inp.value.charAt(0) === ',') {
                inp.value = inp.value.slice(1);
            }
            //update validation
            if (inp.value.includes('-')) {
                VALIDATION.tags = false;
            } else {
                VALIDATION.tags = true;
            }
        });
    });
}

//make the add request form work
const prepareAddForm = () => {
    const addForm = document.getElementById("form-add");

    //first make the checkmarks show after user inputs valid link
    const URL_input = document.getElementById("add_url");
    const cat_input = document.getElementById("add_categorie");
    const tags_input = document.getElementById("add_tags");
    const tags_container = document.getElementById("tagsInAdd");

    URL_input.addEventListener('input', (e) => {
        //validation of the url
        const url = e.target.value;

        if (URL_input.classList.contains('invalid')) {
            URL_input.classList.remove('invalid');
        }

        urlCheck = /^(?:(?:ht|f)tp(?:s?)\:\/\/|~\/|\/)?(?:\w+:\w+@)?((?:(?:[-\w\d{1-3}]+\.)+(?:com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|edu|co\.uk|ac\.uk|it|fr|tv|museum|asia|local|travel|[a-z]{2}))|((\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)(\.(\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)){3}))(?::[\d]{1,5})?(?:(?:(?:\/(?:[-\w~!$+|.,=]|%[a-f\d]{2})+)+|\/)+|\?|#)?(?:(?:\?(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)(?:&(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)*)*(?:#(?:[-\w~!$ |\/.,*:;=]|%[a-f\d]{2})*)?$/i;

        if (urlCheck.test(url)) {
            URL_input.previousElementSibling.querySelector('span').className = 'approved';
            VALIDATION.url = true;
        } else {
            URL_input.previousElementSibling.querySelector('span').className = '';
            VALIDATION.url = false;
        }
    })

    cat_input.addEventListener('input', (e) => {
        //validation of the category only requires it to not be the default value
        const cat = e.target.value;

        if (cat_input.classList.contains('invalid')) {
            cat_input.classList.remove('invalid');
        }

        if (cat !== '-- select an option --') {
            cat_input.previousElementSibling.querySelector('span').className = 'approved';
            VALIDATION.cat = true;
        } else {
            cat_input.previousElementSibling.querySelector('span').className = '';
            VALIDATION.cat = false;
        }
    })

    //tags validation, no "-" allowed in tags, click on tag suggestions does not affect the validation, only the input does
    tags_input.addEventListener('input', (e) => {
        //validation of the tags
        const tags = e.target.value;

        if (tags_input.classList.contains('invalid')) {
            tags_input.classList.remove('invalid');
        }

        //check if there are any "-" in the tags
        if (tags.includes('-')) {
            tags_input.previousElementSibling.querySelector('span').className = '';
            VALIDATION.tags = false;
        } else {
            tags_input.previousElementSibling.querySelector('span').className = 'approved';
            VALIDATION.tags = true;
        }
    })


    // synchroTags(tags_input, tags_container);

    addForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        //check the validation status
        if (!VALIDATION.url) {
            URL_input.classList.add('invalid');
            return
        }
        if (!VALIDATION.cat) {
            cat_input.classList.add('invalid');
            return
        }
        if (!VALIDATION.tags) {
            tags_input.classList.add('invalid');
            return
        }

        const URL = URL_input.value;
        const category = cat_input.options[cat_input.selectedIndex].text;
        let tags = tags_input.value;

        //remove empty tags from the input
        const tagsArray = tags.split(',');
        const newTagsArray = [];
        tagsArray.forEach(tag => {
            if (tag.trim() !== '') {
                newTagsArray.push(tag.trim());
            }
        });
        let clearedTags = newTagsArray.join(',');
        if (clearedTags.charAt(clearedTags.length - 1) === ',') {
            clearedTags = clearedTags.slice(0, clearedTags.length - 1);
        }
        tags_input.value = clearedTags;
        tags = tags_input.value;

        const tagsCheckbox = document.getElementById("tagsCheckbox");
        if (tagsCheckbox.checked) {
            //add tags to the db if user inputs new ones
            const response = await fetch(`updateTags.php?add_tag=${tags}`);
            const data = await response.text();
            if (data !== 'OK') {
                showMsg(data, 'bad');
            }
            //update tags and categories
            await updateTagsCats();
        }

        const response = await fetch(`add.php?url=${URL}&category=${category}&tags=${tags}`);
        const data = await response.text();
        if (data !== 'OK') {
            showMsg(data, 'bad');
        }
        //reset the form
        addForm.reset();
        //reset the checkmarks
        URL_input.previousElementSibling.querySelector('span').className = '';
        cat_input.previousElementSibling.querySelector('span').className = '';
        tags_input.previousElementSibling.querySelector('span').className = '';
        //reset the tags
        tags_container.querySelectorAll('.selected').forEach(tag => {
            tag.classList.remove('selected');
        });
        //update the collection
        await prepareCollection();
        //update the validation status
        VALIDATION.reset();
        //indicate the success
        let URLToShow = URL;
        if (URL.length > 26) {
            URLToShow = URL.slice(0, 26) + '...';
        }
        showMsg(`The link&nbsp;<span>${URLToShow}</span>&nbsp;was added to the collection`);
        //hide the card
        document.getElementById('card-add').classList.add('hide');
    })
}

//make the random request form work
const prepareRandomForm = () => {

    const randomForm = document.getElementById("form-random");

    //tags synchronisation
    const cat_input = document.getElementById("random_categorie");
    const tags_input = document.getElementById("random_tags");
    const tags_container = document.getElementById("tagsInRandom");
    // synchroTags(tags_input, tags_container);

    cat_input.addEventListener('input', (e) => {
        if (cat_input.classList.contains('invalid')) {
            cat_input.classList.remove('invalid');
        }
    })

    randomForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const category = cat_input.options[cat_input.selectedIndex].text;
        const tags = tags_input.value;

        //validate the category
        if (category === '-- select an option --') {
            cat_input.classList.add('invalid');
            return
        }
        const response = await fetch(`random.php?&category=${category}&tags=${tags}`);
        const dataText = await response.text();
        if (dataText.startsWith('error')) {
            showMsg(dataText, 'bad');
        } else {
            const data = JSON.parse(dataText);
            RESULTS = Array.isArray(data) ? data : [];

            document.getElementById('card-random').classList.add('hide')

            if (RESULTS.length === 0) {
                document.getElementById('card-no-results').classList.remove('hide')
            } else {
                fillResultsCard();
            }
        }

        //reset the form
        randomForm.reset();
        //reset the tags
        tags_container.querySelectorAll('.selected').forEach(tag => {
            tag.classList.remove('selected');
        });
    })
}

//function to fill the results card
const fillResultsCard = () => {
    //select one of the results 
    if (!Array.isArray(RESULTS) || RESULTS.length === 0) {
        showMsg('No results to show. Try a different category/tags.', 'info');
        document.getElementById('card-random-result').classList.add('hide');
        return;
    }
    const randomIndex = Math.floor(Math.random() * RESULTS.length);
    const randomResult = RESULTS[randomIndex];
    //update RESULTS to not contain the selected result anymore
    RESULTS.splice(randomIndex, 1);
    //if RESULTS is empty, make the more buttons inactive
    if (RESULTS.length === 0) {
        document.getElementById('more').classList.add('disabled');
        document.getElementById('more').disabled = true;
    } else {
        document.getElementById('more').classList.remove('disabled');
        document.getElementById('more').disabled = false;
    }
    //use the randomResult to fill the card
    document.getElementById('linkToShow').innerHTML = randomResult.linkURL;
    document.getElementById('openURL').href = randomResult.linkURL;
    document.getElementById('copyURL').href = randomResult.linkURL;
    document.getElementById('categorieToShow').innerHTML = randomResult.linkCATEGORY;
    document.getElementById('dateToShow').innerHTML = randomResult.linkDATE;
    //tags need some work to show them properly
    //there is always at least 1 tag, with "-" on both sides
    //first we get rid of this "-" and then we split the string on "-"
    let tagsArr = typeof randomResult.linkTAGS === 'string'
        ? randomResult.linkTAGS.slice(1, randomResult.linkTAGS.length - 1).split('-')
        : ['misc'];
    document.getElementById('card-random-result').querySelector('.existing-tags').innerHTML = '';
    tagsArr.forEach(tag => {
        let tagDiv = document.createElement('div');
        tagDiv.className = 'existing-tag selected';
        tagDiv.innerHTML = tag;
        document.getElementById('card-random-result').querySelector('.existing-tags').appendChild(tagDiv);
    })

    //make remove link button work properly, without stacking event listenters
    const buttonsParent = document.getElementById('more').parentElement;
    const removeBtn = document.createElement('button');
    removeBtn.id = 'linkRemove';
    removeBtn.className = 'card-button';
    removeBtn.innerHTML = 'Remove link';
    removeBtn.addEventListener('click', async () => {
        //ask for confirmation
        if (confirm(`Are you sure you want to remove this link from the collection?`)) {
            const response = await fetch(`delete.php?id=${randomResult.linkID}`);
            const data = await response.text();
            if (data !== 'OK') {
                showMsg(data, 'bad');
            } else {
                //update the collection
                await prepareCollection();
                //if there are still other results, show the next one
                if (RESULTS.length > 0) {
                    fillResultsCard();
                } else {
                    //if there are no more results, close the card and show a message
                    document.getElementById('card-random-result').classList.add('hide');
                    showMsg(`There are no other links matching your search criteria`, 'info');
                }
            }
        }
    })
    buttonsParent.replaceChild(removeBtn, document.getElementById('linkRemove'));

    document.getElementById('card-random-result').classList.remove('hide')
}

//make the more button work
document.getElementById('more').addEventListener('click', () => {
    //there are 2 options here, either the RESULTS is empty, or it has some results
    //if it is empty, the button is already deactivated, so we do nothing
    //if it is not empty, we get random result from it and show it, then remove it from the array
    if (Array.isArray(RESULTS) && RESULTS.length > 0) {
        fillResultsCard();
    }
})

const prepareCollection = async () => {
    const tbody = document.getElementById('card-collection').querySelector('tbody');
    tbody.innerHTML = ''
    let dataArr = [];
    try {
        const response = await fetch('collection.php');
        const data = await response.text();

        if (data.startsWith('error')) {
            showMsg(data, 'bad');
            dataArr = DEFAULT_COLLECTION;
        } else {
            const parsed = JSON.parse(data);
            dataArr = Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_COLLECTION;
        }
    } catch (err) {
        dataArr = DEFAULT_COLLECTION;
    }

    dataArr.forEach(link => {
        //prepate tags from -separated string to array
        const tagsString = typeof link.linkTAGS === 'string' ? link.linkTAGS : '-misc-';
        const trimmed = tagsString.replace(/(^-+|-+$)/g, '');
        const tagsArr = trimmed ? trimmed.split('-').filter(tag => tag.trim() !== '') : ['misc'];
        const dateToShow = link.linkDATE || 'n/a';
        let tr = document.createElement('tr');
        let content = `
            <td>
                <a href="${link.linkURL}" target="_blank" rel="noopener noreferrer">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                </a>
            </td>
            <td>${link.linkCATEGORY || 'Uncategorised'}</td>
            <td><div class="existing-tags">`
        tagsArr.forEach(tag => {
            content += `<div class="existing-tag selected">${tag}</div>`
        })
        content += `
            </div></td>
            <td>${dateToShow}</td>`
        tr.innerHTML = content;
        let del = document.createElement('td');
        del.innerHTML = '<i class="fa-solid fa-trash"></i>'
        del.addEventListener('click', async () => {
            //ask for confirmation
            if (confirm('Are you sure you want to delete this link?')) {
                const response = await fetch(`delete.php?id=${link.linkID}`);
                const data = await response.text();
                if (data !== 'OK') {
                    showMsg(data, 'bad');
                } else {
                    //visually remove the row from the dom
                    tr.remove();
                }
            }
        })
        tr.appendChild(del);
        tbody.appendChild(tr);
    })


}


//functions for settings forms
const prepareSettingsCats = () => {
    const catForm = document.getElementById('updateCats')
    catForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const add_catEl = document.getElementById('add_cat');
        const remove_catEl = document.getElementById('remove_cat');
        const remove_cat = remove_catEl.options[remove_catEl.selectedIndex].text;
        const response = await fetch(`updateCats.php?add_cat=${add_catEl.value}&remove_cat=${remove_cat}`);
        const data = await response.text();
        if (data !== 'OK') {
            showMsg(data, 'bad');
        } else {
            showMsg('Categories list updated', 'good');
        }
        await updateTagsCats();
        catForm.reset();
        document.getElementById('card-configure').classList.add('hide');
    })
}

const prepareSettingsTags = () => {
    //same as above, but for tags
    const tagForm = document.getElementById('updateTags')
    tagForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const add_tagEl = document.getElementById('add_tag');
        const remove_tagEl = document.getElementById('remove_tag');
        const remove_tag = remove_tagEl.options[remove_tagEl.selectedIndex].text;
        const response = await fetch(`updateTags.php?add_tag=${add_tagEl.value}&remove_tag=${remove_tag}`);
        const data = await response.text();
        if (data !== 'OK') {
            showMsg(data, 'bad');
        } else {
            showMsg('Tags list updated', 'good');
        }
        await updateTagsCats();
        tagForm.reset();
        document.getElementById('card-configure').classList.add('hide');
    })
}

//function which gets the currentt TAGS and CATS from db and updates the web page with them
const updateTagsCats = async () => {
    //fetch tags and cats from db using getTagsCats.php
    let tagsCatsJSON;
    try {
        let responseTagsCats = await fetch('getTagsCats.php?')
        let tagsCats = await responseTagsCats.text()
        if (tagsCats.startsWith('latest error')) {
            throw new Error(tagsCats);
        }
        tagsCatsJSON = JSON.parse(tagsCats);
    } catch (err) {
        tagsCatsJSON = [DEFAULT_TAGS, DEFAULT_CATS];
    }
    TAGS = Array.isArray(tagsCatsJSON[0]) && tagsCatsJSON[0].length ? tagsCatsJSON[0] : DEFAULT_TAGS;
    CATS = Array.isArray(tagsCatsJSON[1]) && tagsCatsJSON[1].length ? tagsCatsJSON[1] : DEFAULT_CATS;
    //tags alone exist in add link, random and as options in settings
    let tagsInAdd = document.getElementById("tagsInAdd");
    let tagsInRandom = document.getElementById("tagsInRandom");
    let tagsInSettings = document.getElementById("remove_tag");
    tagsInAdd.innerHTML = '';
    tagsInRandom.innerHTML = '';
    tagsInSettings.innerHTML = '<option disabled selected> -- select an option -- </option>';
    TAGS.forEach(tag => {
        let tagDiv = document.createElement("div");
        let tagOpt = document.createElement('option');
        tagDiv.classList.add("existing-tag");
        tagDiv.innerText = tag;
        tagOpt.innerText = tag;
        tagsInAdd.appendChild(tagDiv);
        tagsInRandom.appendChild(tagDiv.cloneNode(true));
        tagsInSettings.appendChild(tagOpt);
    });

    synchroTags(document.getElementById("add_tags"), tagsInAdd);
    synchroTags(document.getElementById("random_tags"), tagsInRandom);

    //cats alone exist in add link, random and settings, everywhere as options
    let catsInAdd = document.getElementById("add_categorie");
    let catsInRandom = document.getElementById("random_categorie");
    let catsInSettings = document.getElementById("remove_cat");
    catsInAdd.innerHTML = '<option disabled selected> -- select an option -- </option>';
    catsInRandom.innerHTML = '<option disabled selected> -- select an option -- </option>';
    catsInSettings.innerHTML = '<option disabled selected> -- select an option -- </option>';
    CATS.forEach(cat => {
        let catOpt = document.createElement('option');
        catOpt.innerText = cat;
        catsInAdd.appendChild(catOpt);
        catsInRandom.appendChild(catOpt.cloneNode(true));
        catsInSettings.appendChild(catOpt.cloneNode(true));
    });
}

//function for visual confirmations
const showMsg = (msg, type = "good", duration = 3000) => {
    if (!MSG_STATUS) {
        MSG_STATUS = true;
        const msgEl = document.getElementById('msg');

        let icon;
        if (type === "good") {
            icon = '<div><i class="fa-solid fa-check"></i></div>'
        } else if (type === "bad") {
            icon = '<div><i class="fa-solid fa-exclamation"></i></div>'
        } else if (type === "facepalm") {
            icon = '<div><img src="img/facepalm.png" alt="Caïn venant de tuer son frère Abel, by Henri Vidal in Tuileries Garden in Paris, France | https://www.flickr.com/photos/proimos/4199675334/ | Alex E. Proimos | Attribution-NonCommercial 2.0 Generic (CC BY-NC 2.0)"></div>'
        } else {
            icon = '<div><i class="fa-solid fa-info"></i></div>'
        }

        let fs;
        if (msg.length < 75) {
            fs = 20;
        } else if (msg.length < 130) {
            fs = 16;
        } else {
            fs = 14;
        }

        msgEl.innerHTML = `${icon}<div style="font-size:${fs}px">${msg}</div>`;
        msgEl.className = type;

        setTimeout(() => {
            msgEl.className = '';
            MSG_STATUS = false;
        }, duration);
    }
}

document.getElementById('board').addEventListener('click', async () => {
    const config = {
        headers: {
            'Accept': 'application/json'
        }
    }
    const res = await fetch('https://icanhazdadjoke.com', config)
    const data = await res.json()

    showMsg(data.joke, 'facepalm', '5000')
});

//misc
const options = document.getElementById("options")
const copyURL = document.getElementById("copyURL")
let TAGS;
let CATS;

// get initial tags and cats from db
window.onload = async function () {
    //maybe should not be async anymore

    await updateTagsCats();
    prepareAddForm();
    prepareRandomForm();
    prepareSettingsCats();
    prepareSettingsTags();
    await prepareCollection();
    // }

    //on page load add class to the elements
    // window.onload = function () {
    document.getElementById("title").className = "show";
    document.getElementById("options").className = "show";
    document.getElementById("bookshelf").className = "show";
    document.querySelector('footer').className = "show";
}

//making options buttons interactive
const optionsArray = [...options.children]
optionsArray.forEach((opt) => {
    //first make sure all the cards are not displayed
    document.querySelectorAll('card-background').forEach((card) => {
        card.className = "hide";
    })
    //then show selected card
    opt.addEventListener('click', () => {
        document.getElementById(`card-${opt.id}`).classList.remove("hide");
        //also scroll to the top of the page
        window.scrollTo(0, 0);
        document.body.style.overflowY = "hidden";
    })
});

//make cards closeable
document.querySelectorAll('.card-close').forEach((cardClose) => {
    cardClose.addEventListener('click', () => {
        cardClose.parentElement.parentElement.classList.add("hide");
        document.body.style.overflowY = "auto";
    })
})

//also close the no results card when clicking ok
document.getElementById("no-results-ok").addEventListener('click', () => {
    document.getElementById("card-no-results").classList.add("hide");
    document.getElementById("card-random").classList.remove("hide");
})

//make copyURL button work
copyURL.addEventListener('click', (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(copyURL.href);
})
