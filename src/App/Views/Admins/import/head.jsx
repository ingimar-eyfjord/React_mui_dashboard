export default function Row(props) {
  return (
    <tr>
        {Object.keys(props.data).map((s, index2) =>
            <th
            >{s}</th>
        )}
    </tr>
  );
}
