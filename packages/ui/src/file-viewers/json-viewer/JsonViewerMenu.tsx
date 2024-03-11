import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import { GiPlantRoots } from 'react-icons/gi';

import { useFileImporterImmerStore } from '@/file-importer/FileImporter.store';

export function JsonViewerMenu() {
  const fileSlice = useFileImporterImmerStore();
  return (
    <>
      <GiPlantRoots
        size={'2rem'}
        onClick={fileSlice.setToggleTreeView}
        cursor={'pointer'}
        color={fileSlice.toggleTreeView ? 'lime' : 'grey'}
      />
      {fileSlice.toggleLeafNodeValues ? (
        <FaEye
          onClick={fileSlice.setToggleLeafNodeValues}
          size={'2rem'}
          cursor={'pointer'}
          color={fileSlice.toggleLeafNodeValues ? 'skyblue' : 'grey'}
        />
      ) : (
        <FaEyeSlash onClick={fileSlice.setToggleLeafNodeValues} size={'2rem'} cursor={'pointer'} color="grey" />
      )}
    </>
  );
}
