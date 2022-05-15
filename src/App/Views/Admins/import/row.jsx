export default function Row(props) {
  return (
    <tr>
        {Object.keys(props.data).map((s, index2) =>
            <td>{props.data[s]}</td>
        )}
    </tr>
  );
}
