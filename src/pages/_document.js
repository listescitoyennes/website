import Document, { Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <html>
        <Head>
          <meta name="viewport" content="width=device-width, user-scalable=no" />
          <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.3/semantic.min.css"></link>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato:400,700,900|Rubik" />
          <style>{`
            body {
              margin: 0;
              font-family: Lato, Open Sans, Arial;
            }
            .page {
              max-width: 960px;
              width: 100%;
              margin: 2rem auto;
              padding: 0 1rem;
            }
            input, button {
              font-size: 2rem;
            }
            .content {
              margin: 2rem 1rem;
            }
            .row {
              display: flex;
              margin: 1rem 0;
            }
            .home .ui.teal.button {
              margin: 0.5rem 0.5rem 0.5rem 0;
              min-width: 20rem;
            }
            @media (max-width: 600px) {
              .home .ui.teal.button {
                width: 100%;
              }
            }
          `}</style>
        </Head>
        <body className="custom_class">
          <div className="page">
            <Main />
          </div>
          <NextScript />
        </body>
      </html>
    )
  }
}
