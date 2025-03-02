# import json
# from pydantic import BaseModel,Field
# from langchain.tools import tool
# class Source(BaseModel):
#     """Model for a source"""
#     title:str =Field(description="The title of the source")
#     url:str =Field(description="The url of the source")


# class SummarizerInput(BaseModel):
#     """Input for the summalizer tool"""



# @tool(args_shema=SummarizerInput)
# def SummarizeTool(summary:str,sources:list[Source]):
#     """
#     Summarize the final result. Ensure that the summary is complete and
#     includes all relevant information and source links.
#     """


def summarizer():
    pass