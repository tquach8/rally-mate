"use client";

export default function CourtInfoPage({params: {name}}: {params: {name: string}}) {
  return (
    <div>
      <h1>{name}</h1>
    </div>
  );
}
