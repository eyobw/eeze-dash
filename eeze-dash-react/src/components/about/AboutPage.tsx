export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <article>
            <h2 className="text-2xl font-bold mb-2">Customizable Dash App</h2>
            <p className="text-sm text-gray-500 mb-4">
              December, 2016 by{' '}
              <a
                href="https://twitter.com/eyobw"
                className="text-blue-600 hover:underline"
              >
                eyobw
              </a>
            </p>

            <p className="mb-4">
              Customizable-Dash is a browser based client side dashboard framework.
              The framework takes a dataset in JSON format and lets the user design
              the dashboard, with certain flexibility such as drawing frequency bar
              and pie charts, bar charts to compare properties of datasets, and line
              charts for sequential data depending on the property of the dataset
              provided by the user.
            </p>

            <hr className="my-4" />

            <blockquote className="border-l-4 border-gray-300 pl-4 my-4">
              <p className="font-bold mb-2">
                Upload your JSON data and from the side navigation bar click on
                the graph type you would like to draw
              </p>
              <img src="/images/side_nav.png" alt="Side navigation" className="max-w-full" />
            </blockquote>

            <p className="mb-4">
              Sample <strong>Line Chart form</strong> looks like this, optionally
              use the filtering parameter to filter the data, and choose X and Y
              values for the chart. You can select as many y parameters as you like.
            </p>
            <img src="/images/prof_salary.png" alt="Line chart form" className="max-w-full mb-4" />

            <h3 className="text-xl font-bold mt-6 mb-2">Getting Started</h3>
            <p className="mb-2">
              Install the application and run the dev server:
            </p>
            <pre className="bg-gray-100 p-3 rounded mb-2">
              <code>npm install</code>
            </pre>
            <pre className="bg-gray-100 p-3 rounded mb-2">
              <code>npm run dev</code>
            </pre>
            <p className="text-sm text-gray-600">
              The application should start on your default browser at{' '}
              <a href="http://localhost:5173" className="text-blue-600 hover:underline">
                http://localhost:5173
              </a>
            </p>
          </article>
        </div>

        <aside>
          <div className="bg-gray-50 rounded p-4 mb-4">
            <h4 className="font-bold mb-2">About Me</h4>
            <p className="text-sm">I am Eyob, Web developer, and I live in Finland.</p>
          </div>

          <div className="mb-4">
            <h4 className="font-bold mb-2">My works</h4>
            <ul className="list-none text-sm">
              <li>
                <a href="https://etmdb.com" className="text-blue-600 hover:underline">
                  EtMDB
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-2">Links</h4>
            <ul className="list-none text-sm space-y-1">
              <li>
                <a href="https://github.com/eyobw" className="text-blue-600 hover:underline">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://twitter.com/eyobw" className="text-blue-600 hover:underline">
                  Twitter
                </a>
              </li>
              <li>
                <a href="https://facebook.com/eyobw" className="text-blue-600 hover:underline">
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
