// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления
const minWeightInput = document.querySelector('.minweight__input'); // минимальное значение weight
const maxWeightInput = document.querySelector('.maxweight__input'); // максимальное значение weight

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);

const fruitColor = new Map ([
  ['фиолетовый','fruit_violet'],
  ['зеленый','fruit_green'],
  ['розово-красный','fruit_carmazin'],
  ['желтый','fruit_yellow'],
  ['светло-коричневый','fruit_lightbrown']
]);

/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек
const display = (displayFruits) => {

  fruitsList.innerHTML = "";

  for (let i = 0; i < displayFruits.length; i++) {
   let newFruitList = document.createElement('li');
   let fruitClass = fruitColor.get(displayFruits[i].color);
   fruitClass = fruitClass ? fruitClass: 'fruit_black';
   newFruitList.className = `fruit__item ${fruitClass}`;
   newFruitList.innerHTML =
   '<div class="fruit__info">' +
   `<div>index: ${i} </div>` +
   `<div>kind: ${displayFruits[i].kind}</div>` + 
   `<div>color: ${displayFruits[i].color}</div>` +
   `<div>weight (кг): ${displayFruits[i].weight}</div>` +
   '</div>';
   fruitsList.appendChild(newFruitList); 
  }
};

// первая отрисовка карточек
display(fruits);

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива
const shuffleFruits = () => {
  let result = [];

  while (fruits.length > 0) {
    const randomIndex = getRandomInt(0, fruits.length - 1);
    result.push(fruits[randomIndex]);
    fruits.splice(randomIndex, 1);  
  }
  fruits = result;
  return result;
};

shuffleButton.addEventListener('click', () => {
  display(shuffleFruits());
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const filterFruits = () => {
return fruits.filter((item) => { 
   console.log(minWeightInput.value,maxWeightInput.value, item.weight);
    if (item.weight >= parseInt(minWeightInput.value) && item.weight <= parseInt(maxWeightInput.value)){
      return true;
    }
   
  });
 
};

filterButton.addEventListener('click', () => {
  display(filterFruits());
  minWeightInput.value = "";
  maxWeightInput.value = "";
});

/*** СОРТИРОВКА ***/
function swap(items, firstIndex, secondIndex){
  const temp = items[firstIndex];
  items[firstIndex] = items[secondIndex];
  items[secondIndex] = temp;
};

function partition(items, comparation, left, right) {
  var pivot   = items[Math.floor((right + left) / 2)],
      i       = left,
      j       = right;
  while ( j >= i ) {
      while (comparation(pivot, items[i])) {
          i++;
      }
      while (comparation(items[j],pivot)) {
          j--;
      }
      if ( j >= i ) {
          swap(items, i, j);
          i++;
          j--;
      }
  }
  return i;
};

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

const comparationColor = (a, b) => {
    return a.color > b.color;
  // TODO: допишите функцию сравнения двух элементов по цвету
};

const sortAPI = {
  bubbleSort(arr, comparation) {
    const n = arr.length;
    for(let i = 0; i < n-1; i++){
      for(let j = 0; j < n-1; j++){
        if(comparation(arr[j],arr[j+1])){
        let temp = arr[j+1];
        arr[j+1] = arr[j];
        arr[j] = temp;
        }  
      }
    }
  },
  

  quickSort(arr, comparation, left, right) {
    var index;
    if (arr.length > 1) {
        left = typeof left != "number" ? 0 : left;
        right = typeof right != "number" ? arr.length - 1 : right;
        index = partition(arr, comparation, left, right);
        if (left < index - 1) {
          sortAPI.quickSort(arr,comparation, left, index - 1);
          console.log();
        }
        if (index < right) {
          sortAPI.quickSort(arr,comparation, index, right);
        }
    }
    return arr;
    
},
//var result = quickSort(arr);

  // выполняет сортировку и производит замер времени
  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    sort(arr, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
  },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
  if(sortKind === 'bubbleSort'){
    sortKind = 'quickSort';
  }else{
    sortKind = 'bubbleSort';
  }
  sortKindLabel.textContent = sortKind;
  // TODO: переключать значение sortKind между 'bubbleSort' / 'quickSort'
});

sortActionButton.addEventListener('click', () => {
  // TODO: вывести в sortTimeLabel значение 'sorting...'
  const sort = sortAPI[sortKind];
  sortAPI.startSort(sort, fruits, comparationColor);
  display(fruits);
  sortTimeLabel.textContent = sortTime;
  // TODO: вывести в sortTimeLabel значение sortTime
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {
 if (kindInput.value != '' && colorInput.value != '' && weightInput.value != ''){
  
    const newFruit = {
      kind: kindInput.value,
      color: colorInput.value,
      weight: weightInput.value
    };
    
    fruits.push(newFruit); 
    display(fruits);
  }else{
    alert('Введены неполные данные.');
  }
});
