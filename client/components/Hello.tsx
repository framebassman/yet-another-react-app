import * as React from 'react';
const styles = require('./Hello.scss');

export interface HelloProps { compiler: string; framework: string; }

export const Hello = (props: HelloProps) => (
    <div className={styles.hello}>
      <h1>Hello from {props.compiler} and {props.framework}!</h1>
    </div>
  );
