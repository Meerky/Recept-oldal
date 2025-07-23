import './style.css'
import { header } from './header/header.js'

document.getElementById('header').innerHTML = header()

// itt jön a viselkedés logika:
import './header/header_mobil.js'
