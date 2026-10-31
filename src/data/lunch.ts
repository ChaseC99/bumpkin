// Amounts are in cents, transcribed from the organizer's receipt and order notes.
export const lunchReceipt = {
  subtotal: 22029,
  tax: 2038,
  tip: 2203,
  serviceFee: 750,
  total: 27020,
};

// Separate drink amount supplied by the organizer; outside the burrito receipt.
export const lunchDrink = { name: 'Jiwan', item: 'Agua fresca', total: 450 };

const orders = [
  { name: 'Andre', item: 'Regular burrito · Carne asada', price: 1166 },
  {
    name: 'Bryson',
    item: 'Super burrito · Lengua · No sour cream',
    price: 1383,
  },
  { name: 'Jacob', item: 'Super burrito · Pollo', price: 1383 },
  { name: 'Justin', item: 'Super burrito · Pollo', price: 1383 },
  { name: 'Karan', item: 'Regular burrito · Carnitas', price: 1166 },
  { name: 'Tyler', item: 'Super burrito · Pastor', price: 1383 },
  { name: 'Jackie', item: 'California burrito · Carne asada', price: 1405 },
  { name: 'Achinthia', item: 'Regular veggie burrito', price: 1134 },
  { name: 'Jeff', item: 'Shrimp burrito', price: 1615 },
  { name: 'Johnathan', item: 'Super burrito · Carne asada', price: 1383 },
  { name: 'Ajay', item: 'Breakfast burrito · Pollo', price: 1249 },
  { name: 'Luke', item: 'Breakfast burrito · Chorizo', price: 1249 },
  { name: 'Miranda', item: 'Regular burrito · Carnitas', price: 1166 },
  { name: 'Justine', item: 'Breakfast burrito · Chorizo', price: 1249 },
  { name: 'Ray', item: 'Regular burrito · Pastor · No beans', price: 1166 },
  {
    name: 'Stacy',
    item: 'Super burrito · Pastor · No sour cream',
    price: 1383,
  },
  { name: 'Alice', item: 'Regular burrito · Pastor · No beans', price: 1166 },
];

// Split the total in proportion to food prices. Largest remainders receive the
// leftover cents; ties follow the order notes, so the total stays exactly $270.20.
const shares = orders.map((order, index) => ({
  ...order,
  index,
  total: Math.floor((order.price * lunchReceipt.total) / lunchReceipt.subtotal),
  remainder: (order.price * lunchReceipt.total) % lunchReceipt.subtotal,
}));
const remaining =
  lunchReceipt.total - shares.reduce((sum, order) => sum + order.total, 0);
[...shares]
  .sort((a, b) => b.remainder - a.remainder || a.index - b.index)
  .slice(0, remaining)
  .forEach((order) => {
    order.total++;
  });

export const lunchOrders = shares
  .map(({ name, item, price, total }) => ({
    name,
    item,
    price,
    total,
    extras: total - price,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export const lunchItems = orders.reduce<
  { item: string; price: number; quantity: number }[]
>((items, order) => {
  const existing = items.find((item) => item.item === order.item);
  if (existing) existing.quantity++;
  else items.push({ item: order.item, price: order.price, quantity: 1 });
  return items;
}, []);

export const formatMoney = (cents: number) => `$${(cents / 100).toFixed(2)}`;
