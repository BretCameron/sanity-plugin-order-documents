# sanity-plugin-order-documents

Order your Sanity documents via drag-and-drop.

![sanity-plugin-order-documents example](./example.gif)

## Installation

To install the plugin, navigate to the root directory of your Sanity Studio project and run:

```sh
sanity install order-documents
```

Then, open `sanity.json` and append "order-documents" to the `"plugins"` array:

```json
"plugins": [
  "order-documents"
],
```

Now, when you run `sanity start`, you should see the "Order Documents" tab in the top navigation bar.

## Usage

To save a custom order, you'll need to add a hidden `order` field inside the schema file of any document type you want to order.

For example, to add `order` to the "movie" type, go into `./schemas/movie.js` and add:

```js
fields: [
  // other fields,
  {
    name: "order",
    title: "Order",
    type: "number",
    hidden: true,
  },
],
```

Now, when we query our dataset, we can order the results according to the `order` property.

For example, to query movies using Sanity's query language GROQ, we can write:

```groq
*[_type == "movie"] | order(order asc)
```

Our custom order has been saved, and it will be reflected in the result!

## Development

To develop this plugin, clone it into a local directory. Then, navigate to the root of the cloned repository and run:

```sh
yarn
yarn link
yarn start
```

Next, navigate to a Sanity Studio project and run:

```sh
yarn link "sanity-plugin-order-documents"
```

Open `sanity.json` in the Sanity Studio project and append "order-documents" to the `"plugins"` array:

```json
"plugins": [
  "order-documents"
],
```

We're already watching our plugin for changes, so all that's left is to run our Sanity Studio with `sanity start`.
