// <!-- 題目 -->
// <!-- 1. 輸入待辦事項，按下新增按鈕後，於下方列表增加一筆待辦事項 -->
// <!-- 2. 點擊待辦事項後面的X按鈕，可刪除待辦事項 -->
// <!-- 3. 最下方需顯示多少待完成項目，以及點擊"清空所有項目"按鈕後則將所有待辦事項刪除 -->
// <!-- 4. 可使用中間的篩選按鈕來篩選出全部、待完成、已完成的項目 -->
// <!-- 5. 按下待辦事項後面的編輯按鈕，可將該項目帶回上方輸入框，按下修改按鈕後送出便可修改待辦事項 -->


const itemInput = document.querySelector('#item-input');
const addBtn = document.querySelector('#add-btn');
const showCount = document.querySelector('#show-count');
let itemArr = [];
let editingIndex = -1;
addBtn.addEventListener('click', function () {
    if (itemInput.value) {
        if (editingIndex === -1) {
            // 新增
            itemArr.push({ text: itemInput.value, done: false });
        } else {
            // 修改
            itemArr[editingIndex].text = itemInput.value;
            editingIndex = -1;
            addBtn.textContent = '新增';
        }
        updateShowCount();
        renderList();
        itemInput.value = '';
    }
});

const listContainer = document.querySelector('.list');
function renderList() {
    let content = '';
    itemArr.forEach((item, index) => {
        if (currentFilter === 'all' || (currentFilter === 'undone' && !item.done) || (currentFilter === 'done' && item.done)) {
            content += `
            <li class="item">
                <label class="checkbox">
                    <input type="checkbox" class="done-input" ${item.done ? 'checked' : ''} data-index="${index}">
                    <span class="content">${item.text}</span>
                </label>
                <button type="button" class="edit-btn" title="編輯項目" data-index="${index}" aria-label="編輯項目按鈕">X</button>
                <button type="button" class="delete-btn" title="刪除項目" data-index="${index}" aria-label="刪除項目按鈕">X</button>
            </li>`;
        }
    });
    listContainer.innerHTML = content;
    updateShowCount();
}

listContainer.addEventListener('click', function (e) {
    // 刪除
    if (e.target.classList.contains('delete-btn')) {
        itemArr.splice(e.target.dataset.index, 1);
        renderList();
        updateShowCount();
    }
    // 勾選 / 取消
    if (e.target.classList.contains('done-input')) {
        itemArr[e.target.dataset.index].done = e.target.checked;
        updateShowCount();
    }
    // 編輯
    if (e.target.classList.contains('edit-btn')) {
        editingIndex = e.target.dataset.index;
        itemInput.value = itemArr[editingIndex].text;
        addBtn.textContent = '修改';
    }
});

// 清空所有項目
const clearAllBtn = document.querySelector('#clear-all-btn');
clearAllBtn.addEventListener('click', function () {
    itemArr = [];
    renderList();
});


// 篩選
const tabBox = document.querySelector('.tab-box');
let currentFilter = 'all';
tabBox.addEventListener('click', function (e) {
    const status = e.target.dataset.status;
    if (!status) {
        return;
    }

    tabBox.querySelectorAll('[data-status]').forEach(tab => {
        tab.classList.remove('active');
    });
    e.target.classList.add('active');

    currentFilter = status;

    renderList();
});


function updateShowCount() {
    let count;
    if (currentFilter === 'all') {
        count = itemArr.length;
    } else if (currentFilter === 'undone') {
        count = itemArr.filter(item => !item.done).length;
    } else {
        count = itemArr.filter(item => item.done).length;
    }

    let message;
    if (currentFilter === 'all') {
        const undoneCount = itemArr.filter(item => !item.done).length;
        message = `${undoneCount} 個待完成項目`;
    } else if (currentFilter === 'undone') {
        message = `${count} 個待完成項目`;
    } else {
        message = `${count} 個已完成項目`;
    }

    showCount.innerHTML = message;
}

renderList();