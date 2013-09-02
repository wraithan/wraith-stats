var app = 'wraith-stats'
  , db_url = 'https://' + app + '.firebaseio.com/'

function addLoadEvent(func) {
  var oldonload = window.onload;
  if (typeof window.onload !== 'function') {
    window.onload = func;
  } else {
    window.onload = function() {
      if (oldonload) {
        oldonload();
      }
      func();
    }
  }
}

addLoadEvent(function init_auth() {
  var db_root = new Firebase(db_url)
    , login = document.getElementById('login')
    , logout = document.getElementById('logout')
    , auth = new FirebaseSimpleLogin(db_root, login_state_changed)

  function login_state_changed(error, user) {
    if (error) {
      console.log('[main] login failed: ' + error)
    } else if (user) {
      console.log('[main] user is logged in: ' + user.id)
      login.classList.add('hidden')
      logout.classList.remove('hidden')
    } else {
      console.log('[main] no user is logged in')
      login.classList.remove('hidden')
      logout.classList.add('hidden')
    }
  }

  login.addEventListener('click', function loginClick() {
    auth.login('persona')
    return false
  })

  logout.addEventListener('click', function logoutClick() {
    auth.logout()
    return false
  })
})

function build_table(data) {
  var table_holder = document.getElementById('table-holder')
    , header = document.createElement('h2')
    , table = document.createElement('table')
    , thead = document.createElement('thead')
    , thead_tr = document.createElement('tr')
    , tbody = document.createElement('tbody')
    , keys = []

  header.textContent = data.name()
  table_holder.appendChild(header)

  table.id = data.name()
  table.classList.add('table')
  table.appendChild(thead)
  table.appendChild(tbody)

  thead.appendChild(thead_tr)

  var th = document.createElement('th')
  thead_tr.appendChild(th)

  table_holder.appendChild(table)

  function handle_data(data) {
    if (data.name() === '_meta') {
      return
    }
    var tr = document.createElement('tr')
      , first_td = document.createElement('td')
      , row = data.val()
      , tds = {}

    first_td.textContent = data.name()
    tr.appendChild(first_td)

    Object.getOwnPropertyNames(row).forEach(function(element) {
      if (keys.indexOf(element) === -1) {
        keys.push(element)
        var th = document.createElement('th')
        th.textContent = element
        thead_tr.appendChild(th)
      }
      tds[element] = document.createElement('td')
      tds[element].textContent = row[element]
    })
    keys.forEach(function(element) {
      if (tds.hasOwnProperty(element)) {
        tr.appendChild(tds[element])
      } else {
        tr.appendChild(document.createElement('td'))
      }
    })
    tbody.appendChild(tr)
  }
  data.ref().on('child_added', handle_data)
}

addLoadEvent(function load_data() {
  var db_root = new Firebase(db_url)
  db_root.child('public').on('child_added', build_table)
})