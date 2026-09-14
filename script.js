const P = [
  ['Amber Chain Tote', 2000, 'amber-chain-tote.jpg'],
  ['Burgundy Bloom Tote', 2000, 'burgundy-floral-tote.jpg'],
  ['Monochrome Icon Tote', 2000, 'monochrome-classic-tote.jpg'],
  ['Nude Elegance Tote', 2000, 'nude-elegance-tote.jpg'],
  ['Blush Croc Handbag', 2000, 'blush-croc-handbag.jpg'],
  ['Burgundy Luxe Handbag', 2000, 'burgundy-croc-handbag.jpg'],
  ['Golden Girl Art Tote', 2500, 'golden-girl-art-tote.jpg']
];

let C = JSON.parse(localStorage.getItem('amraCart') || '[]');

const m = n => 'Rs. ' + n.toLocaleString('en-PK');


// PRODUCTS SHOW KARNE KE LIYE
function products(id, limit) {
  let e = document.getElementById(id);

  if (!e) return;

  e.innerHTML = P.slice(0, limit || P.length)
    .map((p, i) => `
    
    <div class="product">

      <img src="${p[2]}" alt="${p[0]}">

      <div class="pi">

        <div class="pt">
          <b>${p[0]}</b>
          <span class="price">${m(p[1])}</span>
        </div>

        <button class="buy-now" onclick="buyNow(${i})">
          Buy Now
        </button>

        <button class="add-cart" onclick="add(${i})">
          Add to Cart
        </button>

      </div>

    </div>

  `).join('');
}


// ADD TO CART
function add(i) {

  let x = C.find(x => x.i == i);

  if (x) {
    x.q++;
  } else {
    C.push({
      i: i,
      q: 1
    });
  }

  save();

  // ADD TO CART KE BAAD SIDE CART OPEN HOGA
  openCart();

  toast('Added to cart');
}


// BUY NOW
function buyNow(i) {

  // Selected product ko direct order ke liye cart mein rakho
  C = [
    {
      i: i,
      q: 1
    }
  ];

  save();

  // Direct order form open hoga
  order();
}


// CART SAVE
function save() {
  localStorage.setItem('amraCart', JSON.stringify(C));
  render();
}


// CART RENDER
function render() {

  let items = C.map(x => ({
    ...x,
    p: P[x.i]
  }));

  let n = items.reduce(
    (s, x) => s + x.q,
    0
  );

  let sub = items.reduce(
    (s, x) => s + x.q * x.p[1],
    0
  );

  // Flat delivery
  let del = items.length ? 250 : 0;


  // CART BADGE
  document
    .querySelectorAll('.badge')
    .forEach(x => x.textContent = n);


  // CART ITEMS
  let e = document.getElementById('items');

  if (e) {

    e.innerHTML = items.length

      ? items.map(x => `

        <div class="item">

          <img src="${x.p[2]}" alt="${x.p[0]}">

          <div>

            <b>${x.p[0]}</b>

            <br>

            <small>
              ${m(x.p[1])}
            </small>

            <br>

            <button onclick="qty(${x.i}, -1)">
              −
            </button>

            ${x.q}

            <button onclick="qty(${x.i}, 1)">
              +
            </button>

          </div>

          <b>
            ${m(x.q * x.p[1])}
          </b>

        </div>

      `).join('')

      : '<p class="muted">Your cart is empty.</p>';
  }


  // TOTALS
  ['sub', 'del', 'total'].forEach(id => {

    let x = document.getElementById(id);

    if (x) {

      if (id == 'sub') {
        x.textContent = m(sub);
      }

      else if (id == 'del') {
        x.textContent = m(del);
      }

      else {
        x.textContent = m(sub + del);
      }

    }

  });

}


// QUANTITY CHANGE
function qty(i, d) {

  let x = C.find(x => x.i == i);

  if (!x) return;

  x.q += d;

  if (x.q <= 0) {
    C = C.filter(x => x.i != i);
  }

  save();
}


// OPEN CART
function openCart() {

  document
    .getElementById('drawer')
    .classList.add('open');

  document
    .getElementById('overlay')
    .classList.add('show');

}


// CLOSE CART
function closeCart() {

  document
    .getElementById('drawer')
    .classList.remove('open');

  document
    .getElementById('overlay')
    .classList.remove('show');

}


// ORDER FORM
function order() {

  if (!C.length) {
    return toast('Your cart is empty');
  }


  closeCart();


  document
    .getElementById('modal')
    .classList.add('show');


  let text = C
    .map(
      x => `${P[x.i][0]} x ${x.q} = ${m(P[x.i][1] * x.q)}`
    )
    .join('\n');


  document
    .getElementById('details')
    .value = text;


  let sub = C.reduce(
    (s, x) => s + P[x.i][1] * x.q,
    0
  );


  document
    .getElementById('ototal')
    .value = m(sub + 250);

}


// CLOSE ORDER FORM
function closeModal() {

  document
    .getElementById('modal')
    .classList.remove('show');

}


// TOAST MESSAGE
function toast(t) {

  let e = document.getElementById('toast');

  e.textContent = t;

  e.classList.add('show');

  setTimeout(() => {
    e.classList.remove('show');
  }, 1800);

}


// WEBSITE LOAD
document.addEventListener(
  'DOMContentLoaded',
  () => {

    render();


    let f = document.getElementById('form');


    if (f) {

      f.onsubmit = async e => {

        e.preventDefault();


        try {

          let r = await fetch(
            f.action,
            {
              method: 'POST',
              body: new FormData(f),

              headers: {
                Accept: 'application/json'
              }
            }
          );


          if (!r.ok) {
            throw 0;
          }


          // ORDER KE BAAD CART EMPTY
          C = [];

          save();


          f.innerHTML = `
            <h2>Order Received! ✓</h2>
            <p>
              Your order has been sent to AMRA
              for confirmation.
            </p>
          `;

        }

        catch {

          toast(
            'Could not send order. Try again.'
          );

        }

      };

    }

  }
);
