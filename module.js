class Animal {
  makeSound() {}
}

class Mammal extends Animal {}

class Bird extends Animal {}

class Reptile extends Animal {}

class Dog extends Mammal {
  makeSound() {
    return 'Woof!'
  }
}

class Cat extends Mammal {
  makeSound() {
    return 'Meow!'
  }
}

class Pigeon extends Bird {
  _privateChildMethod() {}

  __protectedChildMethod() {}
}

module.exports = {
  Animal,
  Mammal,
  Bird,
  Reptile,
  Dog,
  Cat,
  Pigeon,
}
