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

  let identificador = pizzaJson[modalKey].id + '@' + tamanho;

  let key = carrinho.findIndex(function (item) {
    return item.identificador === identificador;
  });

  if (key > -1) {
    carrinho[key].quantidade += modalQuantidade;
  } else {
    carrinho.push({
      identificador: identificador,
      id: pizzaJson[modalKey].id,
      tamanho,
      quantidade: modalQuantidade,
    });
  }
  atualizarCarrinho();
  fecharModal();
});

function atualizarCarrinho() {
  c('.menu-openner span').innerHTML = carrinho.length;
  let subtotal = 0;
  let total = 0;
  let desconto = 0;
  if (carrinho.length > 0) {
    c('aside').classList.add('show');
    c('.cart').innerHTML = '';
    for (let i in carrinho) {
      let pizzaItem = pizzaJson.find(function (item) {
        return item.id == carrinho[i].id;
      });
      subtotal += pizzaItem.price * carrinho[i].quantidade;

      let pizzaSizeName;
      switch (carrinho[i].tamanho) {
        case 0:
          pizzaSizeName = 'P';
          break;
        case 1:
          pizzaSizeName = 'M';
          break;
        case 2:
          pizzaSizeName = 'G';
          break;
      }

      let pizzaNome = `${pizzaItem.name} (${pizzaSizeName})`;

      let carrinhoItem = c('.models .cart--item').cloneNode(true);

      carrinhoItem.querySelector('.cart--item-nome').innerHTML = pizzaNome;
      carrinhoItem.querySelector('img').src = pizzaItem.img;
      carrinhoItem.querySelector('.cart--item--qt').innerHTML =
        carrinho[i].quantidade;

      carrinhoItem
        .querySelector('.cart--item-qtmenos')
        .addEventListener('click', function () {
          if (carrinho[i].quantidade > 1) {
            carrinho[i].quantidade--;
          } else {
            carrinho.splice(i, 1);
          }
          atualizarCarrinho();
        });

      carrinhoItem
        .querySelector('.cart--item-qtmais')
        .addEventListener('click', function () {
          carrinho[i].quantidade++;
          atualizarCarrinho();
        });

      c('.cart').append(carrinhoItem);
    }

    desconto = subtotal * 0.1;
    total = subtotal - desconto;

    c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
    c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
    c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
  } else {
    c('aside').classList.remove('show');
    c('aside').style.left = '100vw';
  }
}

c('.menu-openner').addEventListener('click', function () {
  if (carrinho.length > 0) {
    c('aside').style.left = '0';
  }
});

c('.menu-closer').addEventListener('click', function () {
  c('aside').style.left = '100vw';
});
