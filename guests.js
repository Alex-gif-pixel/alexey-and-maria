// Список гостей для именных ссылок.
// Каждому гостю — своя ссылка: index.html?id=ключ
// Пример: index.html?id=petrovy → «Дорогие Иван и Анна Петровы!»
const GUEST_LIST = {
  horoshilovy: { name: 'Иван и Татьяна', count: 2 },
  lagunovy: { name: 'Дмитрий и Антонина', count: 2 },
  bachurin: { name: 'Александр', count: 1, gender: 'male' },
  bannikov: { name: 'Андрей', count: 1, gender: 'male' },
  arhipov: { name: 'Иван', count: 1, gender: 'male' },
  pashkov: { name: 'Кирилл', count: 1, gender: 'male' },
  koltsov: { name: 'Артём', count: 1, gender: 'male' },
  shulgin_titova: {name: 'Александр и Полина', count: 2 },
  krivtsov: { name: 'Николай', count: 1, gender: 'male' },
  chunihin: { name: 'Сергей', count: 1, gender: 'male' },
  perov_novikova: { name: 'Максим и Елизавета', count: 2 },
  kiseleva_kiselev: { name: 'Артур и Татьяна', count: 2 },
  skryabiny: { name: 'Иван и Дарья', count: 2 },
  skorohodovy: { name: 'Илья и Елизавета', count: 2 },
  elima: { name: 'Элима', count: 1, gender: 'female' },
  iman: { name: 'Иман', count: 1, gender: 'female' },
};
