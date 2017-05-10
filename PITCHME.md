---

### Web of Things implementation on Node.js

---

```shell
# Clone the repository
$ git clone https://github.com/thingweb/node-wot

# Go into the repository
$ cd node-wot

# install root dependencies (locally installs tools like typescript and lerna)
npm install
```

+++
###No time for explanations - I want to start from something running!


```shell
cd examples/scripts
wot-servient
```

---

- go to http://localhost:8080/counter and you'll find a thing description.
- you can query the count by http://localhost:8080/counter/properties/count
- you can modify the count via POST on http://localhost:8080/counter/actions/increment and http://localhost:8080/counter/actions/decrement
application logic is in examples/scripts/counter.js

---
###Additional information

How to reate a list of used 3th party libraries?
+++
```shell
# install all used packages (if not already done)
npm install
# install nlf globaly
npm install -g nlf
# create the license file
nlf -c > license-report.cvs
```