import { Box } from "@mui/material";
import { Link } from "@remix-run/react";

export default function PhraseIndexPage() {
  return (
    <Box display="flex">
      <Box mx="auto" mt={6}>
        Ничего не выбрано. Выберите фразу или{" "}
        <Link to="new" className="text-blue-500 underline">
          создайте новую.
        </Link>
      </Box>
    </Box>
  );
}
