import * as React from 'react';
import './Hello.scss';

export interface HelloProps { compiler: string; framework: string; }

export const Hello = (props: HelloProps) => (
    <div className="hello">
      <h1>Hello from {props.compiler} and {props.framework}!</h1>
    </div>
  );
