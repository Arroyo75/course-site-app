import { useEffect, useState } from 'react';
import { useDisclosure, useToast, Box, Text, Heading, VStack, Button, HStack, IconButton, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, ModalCloseButton, Input, ModalFooter } from '@chakra-ui/react';
import { EditIcon, DeleteIcon, DownloadIcon } from '@chakra-ui/icons';
import { useLectureStore } from '../store/lectureStore.jsx';
import { useAuthStore } from '../store/authStore.jsx';

const LectureList = ({ course }) => {

  const [newLecture, setNewLecture] = useState({
    title: "",
    filePath: ""
  })

  const { fetchLectures, createLecture, deleteLecture, updateLecture, lectures } = useLectureStore();
  const { user, isAuthenticated } = useAuthStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isUpdating, setIsUpdating] = useState(false); //Manage create/update modal
  const toast = useToast();

  useEffect(() => {
    if(course?._id) {
      fetchLectures(course._id);
    }
  }, [course]);

  const isAuthor = course?.author?._id === user?.id

  const handleCreateLecture = async (cid, newLecture) => {
    const { success, message } = await createLecture(newLecture, cid);
    onClose();
    if(!success) {
      toast({
        title: 'Error',
        description: message,
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    } else {
      toast({
        title: "Lecture Created",
        description: message,
        status: "success",
        duration: 3000,
        isClosable: true
      })
    }
    setNewLecture({title: "", filePath: ""});
  }

  const handleDeleteLecture = async (lid) => {
    const { success, message } = await deleteLecture(lid);
    if(!success) {
      toast({
        title: 'Error',
        description: message,
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    } else {
      toast({
        title: "Lecture Deleted",
        description: message,
        status: "success",
        duration: 3000,
        isClosable: true
      })
    }
  }

  const handleUpdateLecture = async (lid, newLecture) => {
    console.log("11");
    const { success, message } = await updateLecture(newLecture, lid);
    console.log("22");
    onClose();
    if(!success) {
      toast({
        title: 'Error',
        description: message,
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    } else {
      toast({
        title: "Lecture Updated",
        description: message,
        status: "success",
        duration: 3000,
        isClosable: true
      })
    }
    setNewLecture({title: "", filePath: ""});
  }

  return (
    <Box maxWidth={"75%"}>
      <VStack spacing={4} align="stretch">
        <Heading as={"h1"} size={"xl"} textAlign={"center"}>
          Lectures
        </Heading>
        <VStack spacing={3} align="stretch">
          {lectures.map((lecture) => (
            <Box 
              key={lecture._id}
              p={4}
              colorscheme="white"
              borderRadius="md"
            >
              <HStack>
                <Text>{lecture.title}</Text>
                {isAuthenticated ? (
                  <IconButton icon={<DownloadIcon />} />
                ) : (console.log("22"))}
                {isAuthor ? (
                  <HStack>
                    <IconButton
                      icon={<EditIcon />}
                      onClick={() => {
                        setNewLecture(lecture);
                        setIsUpdating(true);
                        onOpen();
                      }}
                    />
                    <IconButton icon={<DeleteIcon />} onClick={() => handleDeleteLecture(lecture._id)}/>
                  </HStack>
                ) : (console.log("10"))}
              </HStack>
            </Box>
          ))}
          {lectures.length === 0 && (
            <Text fontSize='xl' textAlign={"center"} fontWeight='bold' color='gray.500'>
              No lectures found
            </Text>
          )}
          {isAuthor ? (
          <Button
            onClick={() => {
              setIsUpdating(false);
              onOpen();
            }}
            p={4}
            bg="gray.700"
            borderRadius="md"
            _hover={{ bg: 'gray.600' }}
          >
            <Text>Add Lecture</Text>
          </Button>
          ) : (console.log("1")) }
        </VStack>
      </VStack>
      <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{isUpdating ? "Update Lecture" : "Create Lecture"}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4}>
                        <Input
                            placeholder='Lecture title'
                            name='title'
                            value={newLecture.title}
                            onChange={(e) => setNewLecture({ ...newLecture, title: e.target.value})}
                        >
                        </Input>
                        <Input
                            placeholder='File URL'
                            name='filePath'
                            value={newLecture.filePath}
                            onChange={(e) => setNewLecture({ ...newLecture, filePath: e.target.value})}
                        >
                        </Input>
                    </VStack>
                </ModalBody>
                <ModalFooter>
                  {isUpdating ? (
                    <Button colorScheme='blue' mr={3} onClick={() => handleUpdateLecture(newLecture._id, newLecture)} >
                      Update
                    </Button>
                  ) : (
                    <Button colorScheme='blue' mr={3} onClick={() => handleCreateLecture(course._id, newLecture)} >
                      Create
                    </Button>
                  )}
                    <Button variant='ghost' onClick={onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    </Box>
  )
}

export default LectureList;