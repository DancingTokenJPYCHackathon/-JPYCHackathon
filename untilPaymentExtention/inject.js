async function init() {
    // Add css to floating component
    const link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("href", chrome.runtime.getURL("./views/style.min.css"));
    document.head.appendChild(link)

    // Inject our javascript to page
    const el2 = document.createElement("script")
    el2.setAttribute("src", chrome.runtime.getURL("index.js"))
    document.body.appendChild(el2)

    const el3 = document.createElement("script")
    el3.setAttribute("src", chrome.runtime.getURL("ether.js"))
    document.body.appendChild(el3)

    const el4 = document.createElement("script")
    el4.setAttribute("src", chrome.runtime.getURL("./abi/abi_JPYC.js"))
    document.body.appendChild(el4)

    const el6 = document.createElement("script")
    el6.setAttribute("src", chrome.runtime.getURL("./abi/abi_throwmoneypool.js"))
    document.body.appendChild(el6)

    const el8 = document.createElement("script")
    el8.setAttribute("src", chrome.runtime.getURL("./abi/abi_throwmoneyfactory.js"))
    document.body.appendChild(el8)



    // Inject HTML of floating component
    const div1 = document.createElement("div")
    div1.innerHTML = settings_html;
    document.body.appendChild(div1);



}

settings_html = `<div class="oshi-settings">
    
    <!-- toolbar -->
    <div class="oshi-toolbar">
        <div class="oshi-app-title">
            <div class="oshi-app-logo">
                <img class="oshi-icon" src=${ chrome.runtime.getURL("./img/oshi-icon.png") } alt="">
            </div>
            <span class="oshi-app-name">OSHI サポ !</span>
        </div>
        <span class="oshi-app-close"
        onclick="document.querySelector('.oshi-settings').classList.toggle('visible')"
        ></span>
    </div>

    <!-- balance -->
    <form class="balance l-section" id="oshi-content" onsubmit="return false;">
        <div class="balance-item">
            <h4 class="balance-item__title">Wallet 残高</h4>
            <!-- 値段 -->
            <span id ="wallet_balance" >- JPYC</span>
        </div>
        <div class="balance-item">
            <h4 class="balance-item__title">Pool 残高</h4>
            <!-- 値段 -->
            <span id ="pool_balance">- JPYC</span>
        </div>
        <div class="balance-item">
            <p class="balance-item__label">JPYC の移動額を指定してください</p>
            <input class="balance-item__input" type="number" name="" id="OSH-pool-amount" placeholder="値 (JPYC) を入力" required min="0">
        </div>

        <!-- submit buttons -->
        <div class="oshi-btns">
        <button type="submit" class="oshi-btn tooltip" id="OSH-pool-button" onclick="JPYCPool()">
        <span class="tooltip-text" id="OSH-pool-button-tooltip">注意!<br>入金を行うと一定期間引き出しが行えません!</span>
        <span id="OSH-pool-button-text">入金</span>
        </button>

        <button type="submit" class="oshi-btn" id="OSH-extract-button" onclick="extractPool()">
        出金
        </button>
        </div>
    </form>

    <!-- main content -->
    <form class="oshi-form l-section" id="oshi-content" onsubmit="return false;">
        <div class="oshi-form-item">
            <p class="oshi-form-item__label">OSHI 相手の Wallet アドレス</p>
            <input class="oshi-form-item__input" type="text" name="" id="OSH-wallet-address" required>
        </div>
        <div class="oshi-form-item">
            <p class="oshi-form-item__label">いくら送りますか？</p>
            <input class="oshi-form-item__input" type="number" name="" id="OSH-throw-amount" placeholder="値 (JPYC) を入力" required min="0">
        </div>
        <div class="oshi-form-item">
            <p class="oshi-form-item__label">あなたのニックネーム</p>
            <input class="oshi-form-item__input" type="text" name="" id="OSH-nickname" required>
        </div>
        <div class="oshi-form-item">
            <p class="oshi-form-item__label">応援メッセージをどうぞ！</p>
            <input class="oshi-form-item__input" type="text" name="" id="OSH-throw-message">
        </div>
        <div class="oshi-form-item">
            <p class="oshi-form-item__label" id="">エフェクト (Coming Soon...)</p>
            <select class="oshi-form-item__input" name="" id="" style="opacity: 0.5; pointer-events: none">
                <option value="a">キラキラ</option>
                <option value="b">うさみみ</option>
                <option value="c">NFT</option>
            </select>
        </div>

        <!-- submit button -->
        <button type="submit" class="oshu-btn" onclick="JPYCPayment()">
            OSHU !!
        </button>
	<!-- message box (debug purposes only) -->
        <div>
        <span class="message-box-text" id="message-box"></span>
        </div>
    </form>
</div>

<!-- icon button -->
<div class="oshi_settings_icon" id="oshi_settings_icon"
onclick="document.querySelector('.oshi-settings').classList.toggle('visible')"
>
    <img class="oshi-icon" src=${ chrome.runtime.getURL("./img/oshi-icon.png")} alt="">
</div>
`

init()
