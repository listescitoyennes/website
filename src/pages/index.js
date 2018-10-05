import React from 'react'
import Document from './home.mdx'
import { Button } from 'semantic-ui-react';

const H1 = props => <h1 style={{ color: '#222' }} {...props} />
const InlineCode = props => <code id='codes' style={{ color: 'purple' }} {...props} />
const Code = props => <code id='codes' style={{ fontWeight: 600 }} {...props} />
const Pre = props => <pre id='codes' style={{ color: 'red' }} {...props} />
const A = props => <Button {...props} basic color="teal" onClick={() => window.location.href = props.href } />
export default () => <div className="home"><Document components={{ a: A, h1: H1, pre: Pre, code: Code, inlineCode: InlineCode }} /></div>
