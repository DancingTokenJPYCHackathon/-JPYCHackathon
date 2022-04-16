async function init() {
    // Add css to floating component
    const style = document.createElement("style")
    style.setAttribute("id", "inject-floating")
    style.setAttribute("type", "text/css")
    style.textContent = `
    #floating {
    z-index: 2147400000 !important;
    width: 200px;
    color: black;
    position: fixed;
    left: 10px;
    top: 10px;
    background-color: indianred;
    }

    h3#message {
    font-size: 20px !important;
    }
    `;
    document.head.appendChild(style)

    // Inject our javascript to page
    const el2 = document.createElement("script")
    el2.setAttribute("src", chrome.runtime.getURL("index.js"))
    document.body.appendChild(el2)

    const el3 = document.createElement("script")
    el3.setAttribute("src", chrome.runtime.getURL("ether.js"))
    document.body.appendChild(el3)

    const el4 = document.createElement("script")
    el4.setAttribute("src", chrome.runtime.getURL("abi_JPYC.js"))
    document.body.appendChild(el4)

    const el5 = document.createElement("script")
    el5.setAttribute("src", chrome.runtime.getURL("SETTING.js"))
    document.body.appendChild(el5)

    const el6 = document.createElement("script")
    el6.setAttribute("src", chrome.runtime.getURL("abi_contract.js"))
    document.body.appendChild(el6)

    const el7 = document.createElement("script")
    el7.setAttribute("src", chrome.runtime.getURL("smartcontract.js"))
    document.body.appendChild(el7)




    // Inject HTML of floating component
    const div1 = document.createElement("div")
    div1.setAttribute("id", "floating")

    //Form Label
    const form_label = document.createElement("label")
    form_label.setAttribute("id", "formlabel")
    form_label.textContent = "YoutuberのWalletアドレス"

    // const form_pay = document.createElement("form")
    // form_pay.setAttribute("id", "formforpay")
    
    //改行エレメント
    const return_row = document.createElement("br")


    //Input Wallet Address
    const input_address = document.createElement("input")
    input_address.setAttribute("id", "walletaddress")
    input_address.setAttribute("type", "text")
    input_address.appendChild(return_row)

    // formforpay.appendChild(input_address)
    div1.appendChild(form_label)
    div1.appendChild(input_address)

    //Price Label
    const price_label = document.createElement("label")
    price_label.setAttribute("id", "pricelabel")
    price_label.textContent = "JPYC をいくら送りますか？"

    
    //Input Price
    const input_price = document.createElement("input")
    input_price.setAttribute("id", "superchat_price")
    input_price.setAttribute("type", "text")

    div1.appendChild(price_label)
    div1.appendChild(input_price)
    div1.appendChild(return_row)
    

    //nickname Label
    const name_label = document.createElement("label")
    name_label.setAttribute("id", "namelabel")
    name_label.textContent = "あなたのニックネーム"

    //Input Price
    const input_name = document.createElement("input")
    input_name.setAttribute("id", "nickname")
    input_name.setAttribute("type", "text")

    div1.appendChild(name_label)
    div1.appendChild(input_name)    
    div1.appendChild(return_row)

    //message Label
    const message_label = document.createElement("label")
    message_label.setAttribute("id", "messagelabel")
    message_label.textContent = "応援メッセージをどうぞ！"

    
    //Input Price
    const input_message = document.createElement("input")
    input_message.setAttribute("id", "superchat_message")
    input_message.setAttribute("type", "text")

    div1.appendChild(message_label)
    div1.appendChild(input_message)
    div1.appendChild(return_row)
    
    //effect Label
    const effect_label = document.createElement("label")
    effect_label.setAttribute("id", "effectlabel")
    effect_label.textContent = "エフェクト"

    //Input effect
    const input_effect = document.createElement("select")
    input_effect.setAttribute("id", "effect")
    input_effect.setAttribute("size", "1")

    const optionA = document.createElement("option")
    optionA.setAttribute("value", "A")
    optionA.textContent = "キラキラ"
    input_effect.appendChild(optionA)

    const optionB = document.createElement("option")
    optionB.setAttribute("value", "B")
    optionB.textContent = "うさ耳"
    input_effect.appendChild(optionB)

    const optionC = document.createElement("option")
    optionC.setAttribute("value", "C")
    optionC.textContent = "NFT"
    input_effect.appendChild(optionC)



    div1.appendChild(effect_label)
    div1.appendChild(input_effect)    
    div1.appendChild(return_row)


    // Button for payment
    const button = document.createElement("button")
    button.setAttribute("onclick", "JPYCPayment()")
    button.setAttribute("id", "function_button")
    button.textContent = "SUPERCHAT!!";

    const message_box = document.createElement("h3")
    message_box.setAttribute("id", "message_box")

    div1.appendChild(message_box)
    div1.appendChild(button)

    document.body.appendChild(style)
    document.body.appendChild(div1)



}

init()
