import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDisclosure, useToast, Box, Text, Heading, VStack, Button, HStack, IconButton, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, ModalCloseButton, FormControl, FormLabel, Input, ModalFooter, Progress } from '@chakra-ui/react';
import { EditIcon, DeleteIcon, DownloadIcon, CheckCircleIcon } from '@chakra-ui/icons';
import { useLectureStore } from '../store/lectureStore.jsx';
import { useAuthStore } from '../store/authStore.jsx';

const LectureList = ({ course }) => {

  const [newLecture, setNewLecture] = useState({
    title: "",
    file: null
  })

  const { lectures, fetchLectures, createLecture, deleteLecture, updateLecture, downloadLecture, isLectureCompleted } = useLectureStore();
  const { user, isAuthenticated } = useAuthStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isUpdating, setIsUpdating] = useState(false); //Manage create/update modal
  const toast = useToast();

  useEffect(() => {
    if(course?._id) {
      fetchLectures(course._id);
    }
  }, [course, fetchLectures]);

  const isAuthor = course?.author?._id === user?.id

  const getCompletionPercentage = useLectureStore(state => state.getCompletionPercantage);
  const completionPercentage = getCompletionPercentage();

  const handleCreateLecture = async (cid, lectureData) => {
    const formData = new FormData();
    formData.append('title', lectureData.title);
    formData.append('lecture', lectureData.file);
    formData.append('course', cid);

    const { success, message } = await createLecture(formData);
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

  const handleUpdateLecture = async (lid, lectureData) => {
    const formData = new FormData();
    formData.append('title', lectureData.title);
    if(lectureData.file) {
      formData.append('lecture', lectureData.file);
    }

    const { success, message } = await updateLecture(formData, lid);
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
    setNewLecture({title: "", file: null});
  }

  const handleDownloadLecture = async (lid) => {
    const { success, message } = await downloadLecture(course._id, lid);
    if(!success) {
      toast({
        title: 'Error',
        description: message,
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if(file && file.type !== 'application/pdf') {
      toast({
        title: 'Error',
        description: 'Please upload a PDF file',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
      return;
    }
    setNewLecture(prev=> ({ ...prev, file: file }));
  };

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
                    <HStack spacing={3}>
                      <IconButton
                        icon={<DownloadIcon />}
                        onClick={() => handleDownloadLecture(lecture._id)}
                        fontSize={20}
                        colorScheme="green"
                        variant="ghost"
                        size="sm"
                        _hover={{ bg: 'gray.700' }}
                      />
                      {isLectureCompleted(lecture._id) && (
                        <CheckCircleIcon boxSize={6} color="orange.400" />
                      )}
                    </HStack>
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
          <HStack spacing={4} minW={{ base: "70vw", md: "30vw"}} alignItems="center">
            <Progress 
                value={completionPercentage} 
                colorScheme="green" 
                size="lg"
                mb={4}
                flex="1"
                mt="15px"
                sx={{
                    '& > div': {
                        background: 'linear-gradient(45deg, #1986b1 25%, #2d5382 25%, #2d5382 50%, #1986b1 50%, #1986b1 75%, #2d5382 75%,  #2d5382)',
                        backgroundSize: '1rem 1rem',
                        animation: 'move 1s linear infinite',
                    },
                }}
            />
            <Text fontWeight="bold">{completionPercentage}%</Text>
            <style>
                {`
                    @keyframes move {
                        0% {
                            background-position: 0 0;
                        }
                        100% {
                            background-position: 1rem 0; /* Adjust the speed of the animation */
                        }
                    }
                `}
            </style>
          </HStack>
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
                    <FormControl isRequired>
                      <FormLabel>Title</FormLabel>
                      <Input
                        placeholder='Lecture title'
                        name='title'
                        value={newLecture.title}
                        onChange={(e) => setNewLecture({ ...newLecture, title: e.target.value})}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>{isUpdating ? "Update PDF (optional)" : "Upload PDF"}</FormLabel>
                      <Input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        p={1}
                        border="none"
                        _focus={{ outline: "none" }}
                      />
                    </FormControl>
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
    author: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired
    })
  })
}

export default LectureList;