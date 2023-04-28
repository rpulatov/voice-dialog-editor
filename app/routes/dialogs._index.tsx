import { Box } from "@mui/material";
import { Link } from "@remix-run/react";

export default function NoteIndexPage() {
  return (
    <Box display="flex">
      <Box mx="auto" mt={6}>
        Ничего не выбрано. Выберите диалог или{" "}
        <Link to="new" className="text-blue-500 underline">
          создайте новый.
        </Link>
      </Box>
    </Box>
  );
}
