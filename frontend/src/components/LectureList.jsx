import { useEffect, useState } from 'react';
import { useDisclosure, useToast, Box, Text, Heading, VStack, Button, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, ModalCloseButton, Input, ModalFooter } from '@chakra-ui/react';
import { useLectureStore } from '../store/lectureStore.jsx';
import { useAuthStore } from '../store/authStore.jsx';

const LectureList = ({ course }) => {

  const [newLecture, setNewLecture] = useState({
    title: "",
    filePath: ""
  })

  const { fetchLectures, createLecture, lectures } = useLectureStore();
  const { user } = useAuthStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    if(course?._id) {
      fetchLectures(course._id);
    }
  }, [course]);

  console.log(course._id);
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
              bg="gray.700"
              borderRadius="md"
              _hover={{ bg: 'gray.600' }}
            >
              <Text>{lecture.title}</Text>
            </Box>
          ))}
          {lectures.length === 0 && (
            <Text fontSize='xl' textAlign={"center"} fontWeight='bold' color='gray.500'>
              No lectures found
            </Text>
          )}
          {isAuthor ? (
          <Button
            onClick={onOpen}
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
                <ModalHeader>Create Lecture</ModalHeader>
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
                    <Button colorScheme='blue' mr={3} onClick={() => handleCreateLecture(course._id, newLecture)} >
                        Create
                    </Button>
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