import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDisclosure, useToast, Box, Text, Heading, VStack, Button, HStack, IconButton, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, ModalCloseButton, Input, ModalFooter } from '@chakra-ui/react';
import { EditIcon, DeleteIcon, DownloadIcon } from '@chakra-ui/icons';
import { useLectureStore } from '../store/lectureStore.jsx';
import { useAuthStore } from '../store/authStore.jsx';

const LectureList = ({ course }) => {

  const [newLecture, setNewLecture] = useState({
    title: "",
    file: null
  })

  const { fetchLectures, createLecture, deleteLecture, updateLecture, lectures, downloadLecture } = useLectureStore();
  const { user, isAuthenticated } = useAuthStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isUpdating, setIsUpdating] = useState(false); //Manage create/update modal
  const [downloadingId, setDownloadingId] = useState(null);
  const toast = useToast();

  useEffect(() => {
    if(course?._id) {
      fetchLectures(course._id);
    }
  }, [course, fetchLectures]);

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
    setNewLecture({title: "", file: null});
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
    const { success, message } = await updateLecture(newLecture, lid);
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

  const handleDownload = async (lid) => {
    setDownloadingId(lid);
    try {
      await downloadLecture(lid);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewLecture({ ...newLecture, file });
  }

  return (
    <Box maxWidth={"75%"}>
      <VStack spacing={6} align="stretch">
        <Heading as={"h1"} size={"xl"} textAlign={"center"} color="orange.500" mb={4}>
          Lectures
        </Heading>
        <VStack spacing={4} align="stretch">
          {lectures.map((lecture) => (
            <Box 
              key={lecture._id}
              p={4}
              bg="gray.800"
              borderRadius="lg"
              boxShadow="md"
              border="1px"
              borderColor="orange.300"
              transition="all 0.2s"
              minW={{ base: "70vw", md: "30vw"}}
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "lg",
                borderColor: "orange.200" 
              }}
            >
              <HStack justify="space-between">
                <Text fontSize="lg" fontWeight="medium" color="orange.300">{lecture.title}</Text>
                <HStack spacing={3}>
                  {isAuthenticated && (
                    <IconButton
                      onClick={() => handleDownload(lecture._id)}
                      disabled={downloadingId === lecture._id}
                      icon={<DownloadIcon />}
                      fontSize={20}
                      colorScheme="green"
                      variant="ghost"
                      size="sm"
                      _hover={{ bg: 'gray.700' }}
                    />
                  )}
                  {isAuthor && (
                    <HStack spacing={3}>
                      <IconButton
                        icon={<EditIcon />}
                        onClick={() => {
                          setNewLecture(lecture);
                          setIsUpdating(true);
                          onOpen();
                        }}
                        fontSize={20}
                        colorScheme="blue"
                          variant="ghost"
                          size="sm"
                          _hover={{ bg: 'gray.700' }}
                      />
                      <IconButton
                        icon={<DeleteIcon />}
                        onClick={() => handleDeleteLecture(lecture._id)}
                        fontSize={20}
                        colorScheme="red"
                        variant="ghost"
                        size="sm"
                        _hover={{ bg: 'gray.700'}}
                      />
                    </HStack>
                  )}
                </HStack>
              </HStack>
            </Box>
          ))}
          {lectures.length === 0 && (
            <Text fontSize='xl' textAlign={"center"} fontWeight='bold' color='gray.400' py={8}>
              No lectures found
            </Text>
          )}
          {isAuthor && (
          <Button
            onClick={() => {
              setIsUpdating(false);
              onOpen();
            }}
            size="lg"
            bg="orange.500"
            color="white"
            _hover={{ bg: 'orange.600' }}
            _active={{ bg: 'orange.700' }}
            boxShadow="sm"
            mt={4}
          >
            <Text>Add Lecture</Text>
          </Button>
          )}
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
                            placeholder='File'
                            name='file'
                            type='file'
                            onChange={handleFileChange}
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

LectureList.propTypes = {
  course: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    filePath: PropTypes.string,
    author: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired
    })
  })
}

export default LectureList;