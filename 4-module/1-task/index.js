function makeFriendsList(friends) {
  const ul = document.createElement('ul')

  friends.forEach(element => {
    const li = document.createElement('li')
    li.textContent = `${element.firstName} ${element.lastName}`
    ul.appendChild(li)
  });

  return ul


}

