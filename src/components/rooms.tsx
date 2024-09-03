import { Button } from "@nextui-org/react";

export default function Rooms() {
  return (
    <table>
	<thead >
		<tr>
			<td>Rooms</td>
			<td>Players</td>
			<td></td>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>1234</td>
			<td>1/7</td>
			<td><Button>Join</Button></td>
		</tr>
		<tr>
			<td>5678</td>
			<td>3/7</td>
			<td><Button>Join</Button></td>
		</tr>
		<tr>
			<td>1357</td>
			<td>2/7</td>
			<td><Button>Join</Button></td>
		</tr>
	</tbody>
</table>
  );
}

// import React from "react";
// import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue} from "@nextui-org/react";

// const rows = [
//   {
//     key: "1",
//     name: "Tony Reichert",
//     role: "CEO",
//     status: "Active",
//   },
//   {
//     key: "2",
//     name: "Zoey Lang",
//     role: "Technical Lead",
//     status: "Paused",
//   },
//   {
//     key: "3",
//     name: "Jane Fisher",
//     role: "Senior Developer",
//     status: "Active",
//   },
//   {
//     key: "4",
//     name: "William Howard",
//     role: "Community Manager",
//     status: "Vacation",
//   },
// ];

// const columns = [
//   {
//     key: "name",
//     label: "NAME",
//   },
//   {
//     key: "role",
//     label: "ROLE",
//   },
//   {
//     key: "status",
//     label: "STATUS",
//   },
// ];

// export default function Rooms() {
//   return (
//     <Table aria-label="Example table with dynamic content">
//       <TableHeader columns={columns}>
//         {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
//       </TableHeader>
//       <TableBody items={rows}>
//         {(item) => (
//           <TableRow key={item.key}>
//             {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
//           </TableRow>
//         )}
//       </TableBody>
//     </Table>
//   );
// }
