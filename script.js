var productsDB = new Array();
var feedback = `
<div class=feedback>
    <img src="usr.png">
    <div class="nick"></div>
    <div class="rate"></div>
    <div class="content"></div>
</div>
`;
var catalogElement = `
<div class="catalogElement">
    <img class="image" src=ibanez.png>
    <div class="elementContent">
        <div class="name">itemName</div>
        <div class="price">itemPrice</div>
        <div class="count">itemCount</div>
        <div class="cartButton" onclick="addCart()">В корзину</div>
    </div>
    </div>`;
var cartElement = `
<div class="cartElement">
<img src="ibanez.png">
<div class="cartCont">
<div class="name">name</div>
<div class="item_price">price</div>
<div class="count">count</div>
<div class="selCount">selcount</div>
<div><input type="button" onclick="inputAmount()" value="Ввести"></input></div>
</div>
<div class="cartButtonCont"><div class="cartButton" onclick="delCart()">Удалить</div></div>
</div>
`;
var sampleusr = {
  nick: "max98917",
  password: "12345",
  authorized: 0,
  card: {
    num: "231231",
    expire: "24/02/2026",
    cvv: "111"
  },
  cart: []
}
var sortOrder = true;
var sortQuantity = true;
fetch('products.xml')
    .then(response => response.text())
    .then(xmlData => {
var parser = new DOMParser();
var xml = parser.parseFromString(xmlData, "text/xml");
var productsXML = xml.getElementsByTagName("Product");
var tmp = productsDB;
for (var i = 0; i < productsXML.length; i++) {
  var feedtmp = [];
  var feedbackNodes =
    productsXML[i].getElementsByTagName("Feedbacks")[0].childNodes;
  for (var j = 1; j < feedbackNodes.length; j += 2) {
    feedtmp.push({
      nick: feedbackNodes[j].childNodes[1].textContent,
      rate: feedbackNodes[j].childNodes[3].textContent,
      content: feedbackNodes[j].childNodes[5].textContent,
    });
  }

  productsDB.push({
    name: productsXML[i].getElementsByTagName("Name")[0].textContent,
    type: productsXML[i].getElementsByTagName("Type")[0].textContent,
    price: productsXML[i].getElementsByTagName("Price")[0].textContent,
    count: productsXML[i].getElementsByTagName("Count")[0].textContent,
    selCount: 0,
    image: productsXML[i].getElementsByTagName("Image")[0].textContent,
    desc: productsXML[i].getElementsByTagName("Desc")[0].textContent,
    feedbacks: feedtmp,
  });
}
    });

user = localStorage.getItem("user");
if (!user) {
  localStorage.setItem('user', JSON.stringify(sampleusr));
  window.location.reload();
}
else {
  user = JSON.parse(user);
}
// document.addEventListener("DOMContentLoaded", function() {
//   var element = document.getElementsByClassName("burger")[0];

//   // Добавляем обработчик события при касании экрана
//   element.addEventListener("touchstart", function(event) {
//       // Обработка касания
//       document.getElementsByClassName("mobileMenu")[0].style.display = "block";
//   });
// });
var cartmp = user.cart;
window.onload = () => {
  if (document.getElementsByClassName("cart")[0] !== undefined) {
    if (user.authorized === 0) {
      alert("Вы не авторизированы. Пожалуйста войдите в аккаунт.");
      window.location.href = "index.html";
    }
  }
  if (document.getElementsByClassName("productMain")[0] !== undefined) {
    document.getElementsByClassName("footerBlock")[0].remove();
    loadProductInfo();
  }
  if (user.authorized === 1) {
    var log = document.getElementsByClassName("log")[0];
    while (log.firstChild) {
      log.removeChild(log.firstChild);
    }
    log.insertAdjacentHTML(
      "beforeend",
      `
          <div class="mobiButton" onclick="loginButton()">Войти</div>
          `
    );
    document.getElementsByClassName("loginButton")[0].innerHTML = user.nick;
    document.getElementsByClassName("mobiButton")[0].innerHTML = user.nick;
    if (document.getElementById("nick")) {
      document.getElementById("nick").innerHTML = user.nick;
    }
  }
  refreshFeed();
  refreshCatalog(productsDB);
  refreshCart(user.cart);
};
function inputAmount(selc, i) {
  var sel = prompt(
    "Введите количество которое надо положить в корзину:",
    selc.selCount
  );
  console.log(parseInt(sel) < 1);
  console.log(selc.count);
  if (
    isNaN(parseFloat(sel)) ||
    parseInt(sel) < 0 ||
    parseInt(sel) > parseInt(selc.count)
  ) {
    alert("Неправильный ввод!");
  } else {
    user.cart[i].selCount = sel;
    localStorage.setItem("user", JSON.stringify(user));
    refreshCart(user.cart);
  }
}
function addCart(name, i) {
  if (user.authorized === 0) {
    alert("Вы не можете добавить товар в корзину. Пожалуйста, авторизуйтесь.");
    window.location.href = "index.html";
    return;
  }
  var del = false;
  user.cart.map((element) => {
    if (element.name === name) {
      if (
        document.getElementsByClassName("cartButton")[i].innerHTML === "Удалить"
      ) {
        user.cart = user.cart.filter(function (item) {
          return item.name !== name;
        });
        document.getElementsByClassName("cartButton")[i].innerHTML =
          "В корзину";
        document.getElementsByClassName("cartButton")[i].style =
          "background-color: green;";
        del = true;
      }
    }
  });
  if (del === false) {
    console.log(name);
    productsDB.map((element) => {
      console.log(element.name + " " + name);
      console.log(element.name === name);
      if (element.name === name) {
        console.log(user.cart.push(element));
      }
    });
    document.getElementsByClassName("cartButton")[i].innerHTML = "Удалить";
    document.getElementsByClassName("cartButton")[i].style =
      "background-color: red;";
  }
  localStorage.setItem("user", JSON.stringify(user));
  refreshCatalog(tmp);
}
function delCart(name) {
  console.log(name);
  user.cart.map((element) => {
    if (element.name === name) {
      user.cart = user.cart.filter(function (item) {
        return item.name !== name;
      });
    }
  });
  localStorage.setItem("user", JSON.stringify(user));
  refreshCart(user.cart);
}
const cartSearch = () => {
  carttmp = [];
  user.cart.map((element, index) => {
    if (element.name.includes(document.getElementById("search").value)) {
      carttmp = [...carttmp, element];
    }
  });
  refreshCart(carttmp);
};
const search = () => {
  tmp = [];
  productsDB.map((element, index) => {
    if (element.name.includes(document.getElementById("search").value)) {
      tmp = [...tmp, element];
    }
  });
  refreshCatalog(tmp);
};
const casort = (...str) => {
  tmp = [];
  productsDB.map((element, index) => {
    console.log(element.type === str[0]);
    if (element.type === str[0]) {
      tmp = [...tmp, element];
      console.log(tmp);
    }
  });
  refreshCatalog(tmp);
};
const sortPrice = () => {
  if (sortOrder === true) {
    tmp.sort((a, b) => a.price - b.price);
    sortOrder = false;
  } else {
    tmp.sort((a, b) => b.price - a.price);
    sortOrder = true;
  }
  refreshCatalog(tmp);
};
const sortByQuantity = () => {
  if (sortQuantity === true) {
    tmp.sort((a, b) => a.count - b.count);
    sortQuantity = false;
  } else {
    tmp.sort((a, b) => b.count - a.count);
    sortQuantity = true;
  }
  refreshCatalog(tmp);
};
function loadProductInfo() {
  var param = location.search.substr(1);
  var elem;
  productsDB.map((element) => {
    if (element.name === param) {
      elem = element;
    }
  });
  if (user.authorized === 0) {
    var parent = document.getElementsByClassName("productContent")[0];
    parent.removeChild(document.getElementsByClassName("cartButton")[0]);
  }
  document.getElementsByClassName("productMain")[0].childNodes[1].src =
    elem.image;
  document.getElementsByClassName("productContent")[0].childNodes[1].innerHTML =
    elem.name;
  document.getElementsByClassName("productContent")[0].childNodes[3].innerHTML =
    elem.price + " BYN";
  document.getElementsByClassName("productContent")[0].childNodes[5].innerHTML =
    "На складе: " + elem.count;
  document.getElementsByClassName("productDesc")[0].innerHTML = elem.desc;
}
function refreshFeed() {
  var ind;
  productsDB.map((element, index) => {
    if (location.search.substr(1) === element.name) {
      ind = index;
    }
  });
  if (document.getElementsByClassName("productBlock")[0] !== undefined) {
    var productFeed = document.getElementsByClassName("productFeed")[0];
    while (productFeed.firstChild) {
      productFeed.removeChild(productFeed.firstChild);
    }
    productFeed = document.getElementsByClassName("productFeed")[0];
    for (i = 0; i < productsDB[ind].feedbacks.length; i++) {
      productFeed.insertAdjacentHTML("beforeend", feedback);
    }
  }
  feed = document.getElementsByClassName("feedback");

  for (i = 0; i < feed.length; i++) {
    feed[i].childNodes[3].innerHTML = productsDB[ind].feedbacks[i].nick;
    feed[i].childNodes[5].innerHTML = productsDB[ind].feedbacks[i].rate + "/5";
    feed[i].childNodes[7].innerHTML = productsDB[ind].feedbacks[i].content;
  }
}
function refreshCart(arr) {
  if (document.getElementsByClassName("cartContent")[0] !== undefined) {
    var cartContent = document.getElementsByClassName("cartContent")[0];
    while (cartContent.firstChild) {
      cartContent.removeChild(cartContent.firstChild);
    }
    cartContent = document.getElementsByClassName("cartContent")[0];
    for (i = 0; i < arr.length; i++) {
      cartContent.insertAdjacentHTML("beforeend", cartElement);
    }
    var cartContent = document.getElementsByClassName("cartElement");
    for (i = 0; i < cartContent.length; i++) {
      (function (index) {
        cartContent[index].childNodes[1].src = arr[index].image;
        cartContent[index].childNodes[3].childNodes[1].innerHTML =
          arr[index].name;
        cartContent[index].childNodes[3].childNodes[3].innerHTML =
          arr[index].price + " BYN";
        cartContent[index].childNodes[3].childNodes[5].innerHTML =
          "Количество: " + arr[index].count;
        cartContent[index].childNodes[3].childNodes[7].innerHTML =
          "Кол-во в корзине: " + arr[index].selCount;
        cartContent[index].childNodes[5].childNodes[0].onclick = function () {
          delCart(arr[index].name);
        };
        cartContent[index].childNodes[3].childNodes[9].childNodes[0].onclick =
          function () {
            inputAmount(arr[index], index);
          };
      })(i);
    }
    var sum = 0;
    user.cart.map((element) => {
      sum += parseFloat(element.price) * parseFloat(element.selCount);
    });
    if (document.getElementById("delivery").checked) {
      sum += 10;
    }
    document.getElementsByClassName("price")[0].innerHTML =
      "Итого: " + sum + " BYN";
  }
}
function refreshCatalog(arr) {
  if (document.getElementsByClassName("catalogContent")[0] !== undefined) {
    var catalogContent = document.getElementsByClassName("catalogContent")[0];
    while (catalogContent.firstChild) {
      catalogContent.removeChild(catalogContent.firstChild);
    }
    catalogContent = document.getElementsByClassName("catalogContent")[0];
    for (i = 0; i < arr.length; i++) {
      catalogContent.insertAdjacentHTML("beforeend", catalogElement);
    }
  }
  var elementContent = document.getElementsByClassName("catalogElement");
  for (i = 0; i < elementContent.length; i++) {
    (function (index) {
      elementContent[index].childNodes[1].src = arr[index].image;
      elementContent[index].childNodes[3].childNodes[1].innerHTML =
        arr[index].name;
      elementContent[index].childNodes[3].childNodes[1].onclick = function () {
        window.location.href = "product.html?" + arr[index].name;
      };
      elementContent[index].childNodes[3].childNodes[3].innerHTML =
        arr[index].price + " BYN";
      elementContent[index].childNodes[3].childNodes[5].innerHTML =
        "Количество: " + arr[index].count;
      elementContent[index].childNodes[3].childNodes[7].onclick = function () {
        addCart(arr[index].name, index);
      };
      if (user.authorized === 0) {
        var parent = document.getElementsByClassName("elementContent")[index];
        parent.removeChild(document.getElementsByClassName("cartButton")[0]);
      }
      user.cart.map((element) => {
        if (element.name === arr[index].name) {
          document.getElementsByClassName("cartButton")[i].innerHTML =
            "Удалить";
          document.getElementsByClassName("cartButton")[i].style =
            "background-color: red;";
        }
      });
    })(i);
  }
}
//localStorage.setItem("user", JSON.stringify(user));

let button = 0;
const loginButton = () => {
  if (user.authorized === 1) {
    window.location.href = "user.html";
  } else {
    if (button == 0) {
      document.getElementsByClassName("loginBlock")[0].style.display = "flex";
      document.getElementsByClassName("loginButton")[0].style.borderRadius =
        "25px 25px 0px 0px";
      button = 1;
    } else {
      document.getElementsByClassName("loginBlock")[0].style.display = "none";
      document.getElementsByClassName("loginButton")[0].style.borderRadius =
        "25px 25px 25px 25px";
      button = 0;
    }
  }
};
let mobilemenu = 0;
const mobileMenu = () => {
  var foot = document.getElementsByClassName("footerBlock")[0];
  if (mobilemenu == 0) {
    document.getElementsByClassName("mobileMenu")[0].style.display = "flex";
    if (foot) {
      foot.style.display = "none";
    }
    document.getElementsByClassName("contentBlock")[0].style.display = "none";
    mobilemenu = 1;
  } else {
    document.getElementsByClassName("mobileMenu")[0].style.display = "none";
    if (foot) {
      foot.style.display = "flex";
    }
    document.getElementsByClassName("contentBlock")[0].style.display = "flex";
    mobilemenu = 0;
  }
};
const authorize = () => {
  let arrs = document.getElementsByClassName("loginInput");
  if (
    (arrs[0].value === user.nick && arrs[1].value === user.password) ||
    (arrs[2].value === user.nick && arrs[3].value === user.password)
  ) {
    user.authorized = 1;
    localStorage.setItem("user", JSON.stringify(user));
    location.reload();
  } else {
    alert("Неверные данные!");
  }
};
const unauthorize = () => {
  user.authorized = 0;
  localStorage.setItem("user", JSON.stringify(user));
  window.location.href = "index.html";
};
const pay = () => {
  var offerInput = document.getElementsByClassName("offerInput");
  if (
    offerInput[0].value.length > 1 ||
    offerInput[1].value.length > 1 ||
    offerInput[2].value.length > 1
  ) {
    if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(offerInput[4].value)) {
      if (
        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(
          offerInput[5].value
        )
      ) {
        alert("Заказ отправлен в обработку");
        user.cart = [];
        localStorage.setItem("user", JSON.stringify(user));
        window.location.href = "index.html";
      } else {
        alert("Неверный телефон!");
      }
    } else {
      alert("Неверная почта!");
    }
  } else {
    alert("Введите ФИО!");
  }
};
const save = () => {
  if (/^\d+$/.test(document.getElementsByClassName("cardInput")[0].value)) {
    user.card.num = document.getElementsByClassName("cardInput")[0].value;
    if (
      /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/.test(
        document.getElementsByClassName("cardInput")[1].value
      )
    ) {
      user.card.expire = document.getElementsByClassName("cardInput")[1].value;
      if (
        /^\d{3}$/.test(document.getElementsByClassName("cardInput")[2].value)
      ) {
        user.card.cvv = document.getElementsByClassName("cardInput")[2].value;
        localStorage.setItem("user", JSON.stringify(user));
        alert("Данные сохранены");
        location.reload();
      } else {
        alert("Неверный код CVV!");
      }
    } else {
      alert("Неверный срок годности!");
    }
  } else {
    alert("Неверный номер карты!");
  }
};
function a() {if (document.getElementsByClassName('filterList')[0].style.display === 'none') {document.getElementsByClassName('filterList')[0].style.display = 'block'; document.getElementsByClassName('catalogFilter')[0].style = 'width: 30%'; } else {document.getElementsByClassName('filterList')[0].style.display = 'none'; document.getElementsByClassName('catalogFilter')[0].style = 'width: 10%';}}