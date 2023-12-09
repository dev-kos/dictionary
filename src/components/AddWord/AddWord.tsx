import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  TextField,
  Box,
  Button,
  FormGroup,
} from "@mui/material";
import { Dictionary, DictionaryItem } from "../../types";

export const AddWord = ({
  handleOpen,
  isOpen,
  onSuccess,
}: {
  isOpen: boolean;
  handleOpen: (val: boolean) => void;
  onSuccess: () => void;
}) => {
  const [ruWord, setRuWord] = useState<string>("");
  const [enWord, setEnWord] = useState<string>("");

  const isDisabled = ruWord.trim().length === 0 || enWord.trim().length === 0;

  useEffect(() => {
    if (!isOpen) {
      setRuWord("");
      setEnWord("");
    }
  }, [isOpen]);

  const handleSave = () => {
    const entity: DictionaryItem = {
      ru: ruWord,
      en: enWord,
      id: ruWord + enWord,
    };
    const rawDictionary = localStorage.getItem("dictionary");

    if (!rawDictionary) {
      localStorage.setItem("dictionary", JSON.stringify([entity]));
    } else {
      const dictionary: Dictionary = JSON.parse(rawDictionary);
      localStorage.setItem(
        "dictionary",
        JSON.stringify([entity, ...dictionary])
      );
    }

    onSuccess();
    handleOpen(false);
  };

  return (
    <Dialog open={isOpen} onClose={() => handleOpen(false)} fullWidth>
      <Box
        sx={{ padding: "20px 20px", display: "flex", flexDirection: "column" }}
      >
        <DialogTitle textAlign={"center"}>Set the new word</DialogTitle>
        <FormGroup>
          <TextField
            id="standard-basic"
            label="Set word in English"
            variant="standard"
            value={enWord}
            onChange={(e) => setEnWord(e.target.value)}
          />
        </FormGroup>
        <FormGroup sx={{ margin: "20px 0" }}>
          <TextField
            id="standard-basic"
            label="Set word in Russian"
            variant="standard"
            value={ruWord}
            onChange={(e) => setRuWord(e.target.value)}
          />
        </FormGroup>
        <Button variant="contained" disabled={isDisabled} onClick={handleSave}>
          Save
        </Button>
      </Box>
    </Dialog>
  );
};
