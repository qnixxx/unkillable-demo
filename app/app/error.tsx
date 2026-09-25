"use client";
export default function Error({ reset }: { reset: () => void }) { return <div className="card empty-state"><h3>Something interrupted the system.</h3><p>Your data is still stored locally. Reload this view and keep moving.</p><button className="button button-primary" onClick={reset}>Try again</button></div>; }
