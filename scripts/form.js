const ACTION_URL = "https://script.google.com/macros/s/AKfycbznax5M2iNRJofoLMhl1ov6r5ZCQck-Fa4Rx1vSy4zSYINgwcc4D2rEr7R9IS-qe8q5/exec"

export const submit = (e) => {
	e.preventDefault()
  
  let xhr  = new XMLHttpRequest()
  let form = e.target
  let data = {}
  let encoded
  let error
  
  [...form.elements]
    .filter(e => e.name)
    .map(e => data[e.name] = e.value)
  
  if (Object.keys(data).filter(k => !data[k]).length) {
    return ({error: "Your fields are empty!"})
  } else if (!/.+@\w+\.\w+/g.test(data.email)) {
    return ({error: "That email don’t look right."})
  }
  
	xhr.open('POST', ACTION_URL)
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) true
  }
  
  // url encode form data for sending as post data
  encoded = Object.keys(data)
    .map(k => encodeURIComponent(k) + "=" + encodeURIComponent(data[k]))
    .join('&')
  
  xhr.send(encoded)
  
	return data
}
