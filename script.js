let modalQuantidade = 1;
let carrinho = [];
let modalKey = 0;

const c = function (elemento) {
  return document.querySelector(elemento);
};

const cs = function (elementos) {
  return document.querySelectorAll(elementos);
};

//Listagem das Pizzas

pizzaJson.map(function (item, index) {
  let pizzaItem = c('.models .pizza-item').cloneNode(true);

  pizzaItem.setAttribute('data-key', index);

  pizzaItem.querySelector('.pizza-item--img img').src = item.img;

  pizzaItem.querySelector(
    '.pizza-item--price'
  ).innerHTML = `R$ ${item.price.toFixed(2)}`;

  pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;

  pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

  pizzaItem.querySelector('a').addEventListener('click', function (evento) {
    evento.preventDefault();

    let key = evento.target.closest('.pizza-item').getAttribute('data-key');
    modalQuantidade = 1;
    modalKey = key;

    c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
    c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
    c('.pizzaBig img').src = pizzaJson[key].img;
    c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(
      2
    )}`;

    c('.pizzaInfo--size.selected').classList.remove('selected');

    cs('.pizzaInfo--size').forEach(function (size, sizeIndex) {
      if (sizeIndex === 2) {
        size.classList.add('selected');
      }
      size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
    });

    c('.pizzaInfo--qt').innerHTML = modalQuantidade;

    c('.pizzaWindowArea').style.opacity = 0;
    c('.pizzaWindowArea').style.display = 'flex';
    setTimeout(function () {
      c('.pizzaWindowArea').style.opacity = 1;
    }, 250);
  });

  c('.pizza-area').append(pizzaItem);
});

//Eventos do MODAL

function fecharModal() {
  c('.pizzaWindowArea').style.opacity = 0;
  setTimeout(function () {
    c('.pizzaWindowArea').style.display = 'none';
  }, 500);
}

cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach(
  function (item) {
    item.addEventListener('click', fecharModal);
  }
);

c('.pizzaInfo--qtmenos').addEventListener('click', function () {
  if (modalQuantidade >= 2) {
    modalQuantidade = modalQuantidade - 1;
    c('.pizzaInfo--qt').innerHTML = modalQuantidade;
  }
});

c('.pizzaInfo--qtmais').addEventListener('click', function () {
  modalQuantidade = modalQuantidade + 1;
  c('.pizzaInfo--qt').innerHTML = modalQuantidade;
});

cs('.pizzaInfo--size').forEach(function (size) {
  size.addEventListener('click', function () {
    c('.pizzaInfo--size.selected').classList.remove('selected');
    size.classList.add('selected');
  });
});

c('.pizzaInfo--addButton').addEventListener('click', function () {
  let tamanho = parseInt(
    c('.pizzaInfo--size.selected').getAttribute('data-key')
  );
  carrinho.push({
    id: pizzaJson[modalKey].id,
    tamanho,
    quantidade: modalQuantidade,
  });

  fecharModal();
});
